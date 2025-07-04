from config.database import mydb
from langchain.chat_models import ChatLiteLLM
from langchain.prompts import ChatPromptTemplate
import os

llm = ChatLiteLLM(
    model="openrouter/deepseek/deepseek-chat-v3-0324:free",
    temperature=0.5,
    api_key=os.getenv("LITELLM_API_KEY"),
    provider="openrouter",
    base_url="https://openrouter.ai/api/v1"
)

prompt_template = ChatPromptTemplate.from_template(
    "Voici un résumé des données de la base de données :\n\n"
    "{data_summary}\n\n"
    "Réponds précisément à cette question :\n"
    "{question}"
)

def read_all_db():
    cursor = mydb.cursor()
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()

    all_data = {}

    for (table_name,) in tables:
        table_cursor = mydb.cursor(dictionary=True)
        table_cursor.execute(f"SELECT * FROM {table_name}")
        rows = table_cursor.fetchall()
        table_cursor.close()

        all_data[table_name] = rows

    cursor.close()
    return all_data

def get_chatbot_response(question: str) -> str:
    try:
        all_data = read_all_db()

        # Construire un résumé limité (max 5 lignes par table)
        summary = ""
        for table, rows in all_data.items():
            summary += f"Table {table} ({len(rows)} lignes) :\n"
            for row in rows[:5]:
                summary += f"  {row}\n"
            if len(rows) > 5:
                summary += "  ...\n"
            summary += "\n"

        prompt = prompt_template.format_messages(
            data_summary=summary,
            question=question
        )

        response = llm.invoke(prompt)
        return response.content

    except Exception as e:
        return f"❌ Erreur dans le traitement IA : {str(e)}"
