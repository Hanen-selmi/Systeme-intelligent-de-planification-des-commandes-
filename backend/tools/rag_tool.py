import os
import warnings
from pydantic import PrivateAttr

warnings.filterwarnings("ignore", category=DeprecationWarning)

from crewai.tools import BaseTool
from langchain_community.document_loaders import UnstructuredFileLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

from langchain.chat_models import ChatLiteLLM
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

from typing import Optional


class RagTool(BaseTool):
    name: str = "Recherche RAG"
    description: str = "Recherche sur un fichier"
    retriever: Optional[object] = None

    # Attributs privés non validés par Pydantic
    _llm: ChatLiteLLM = PrivateAttr()
    _chain: LLMChain = PrivateAttr()
    _prompt: PromptTemplate = PrivateAttr()

    def __init__(self, file_path: str):
        super().__init__()
        loader = UnstructuredFileLoader(file_path)
        documents = loader.load()

        text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        texts = text_splitter.split_documents(documents)

        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        db = FAISS.from_documents(texts, embeddings)

        self.retriever = db.as_retriever()

        self._llm = ChatLiteLLM(
            model="openrouter/deepseek/deepseek-chat-v3-0324:free",
            temperature=0.5,
            api_key=os.getenv("LITELLM_API_KEY"),
            provider="openrouter",
            base_url="https://openrouter.ai/api/v1"
        )

        self._prompt = PromptTemplate(
            input_variables=["context", "question"],
            template=(
                "Tu es un assistant intelligent. En te basant sur ces informations :\n{context}\n"
                "Réponds à la question suivante de manière concise et claire :\n{question}"
            )
        )

        self._chain = LLMChain(llm=self._llm, prompt=self._prompt)

    def _run(self, query: str) -> str:
        docs = self.retriever.get_relevant_documents(query)
        if not docs:
            return "Désolé, je n'ai pas trouvé d'information pertinente."

        context = "\n\n".join([doc.page_content for doc in docs])
        response = self._chain.run({"context": context, "question": query})

        return response

    async def _arun(self, query: str) -> str:
        return self._run(query)
