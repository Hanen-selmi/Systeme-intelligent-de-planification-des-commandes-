from crewai import Agent
from langchain.chat_models import ChatLiteLLM
from dotenv import load_dotenv
import os
from tools.rag_tool import RagTool  # ta nouvelle classe

load_dotenv()

rag_tool_production = RagTool("data/production.csv")
rag_tool_machine = RagTool("data/machines.txt")
rag_tool_rh = RagTool("data/ressources_humaines.csv")

llm = ChatLiteLLM(
    model="openrouter/deepseek/deepseek-chat-v3-0324:free",
    temperature=0.5,
    max_tokens=300,
    api_key=os.getenv("LITELLM_API_KEY"),
    provider="openrouter",
    base_url="https://openrouter.ai/api/v1"
)

agent_stock = Agent(
    role="Agent de Stock",
    goal="Vérifie si les pièces sont disponibles",
    backstory="Expert en gestion des stocks",
    llm=llm,
    verbose=True,
    allow_delegation=False
)

agent_production = Agent(
    role="Agent de Production",
    goal="Planifie la production selon le stock et les délais",
    backstory="Chef de production",
    llm=llm,
    tools=[rag_tool_production, rag_tool_machine, rag_tool_rh],
    verbose=True,
    allow_delegation=True 
)

agent_machine = Agent(
    role="Agent Machine",
    goal="Vérifie la disponibilité des machines",
    backstory="Technicien en maintenance",
    llm=llm,
    tools=[rag_tool_machine],
    verbose=True,
    allow_delegation=False
)

agent_rh = Agent(
    role="Agent RH",
    goal="Vérifie la disponibilité des employés",
    backstory="Responsable RH",
    llm=llm,
    tools=[rag_tool_rh],
    verbose=True,
    allow_delegation=False
)
agent_synthese = Agent(
    role="Agent Synthèse",
    goal="Produire un rapport clair et synthétique des résultats des agents stock, production, machine, et RH",
    backstory="Analyste expérimenté en gestion de production",
    llm=llm,
    tools=[], 
    verbose=True,
    allow_delegation=False
)
