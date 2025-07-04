# test_rag_tool_interactive.py

from tools.rag_tool import rag_tool_from_file

def main():
    # Charge ton outil avec ton fichier stock.txt
    rag_tool = rag_tool_from_file("data/stock.txt")
    
    print(f"Nom de l'outil: {rag_tool.name}")
    print(f"Description: {rag_tool.description}\n")
    
    while True:
        query = input("Pose ta question (ou 'exit' pour quitter) : ")
        if query.lower() == "exit":
            break
        
        # Appelle la fonction de l'outil (rag_function)
        response = rag_tool.func(query)
        
        print("\nRéponse :")
        print(response)
        print("-" * 40)

if __name__ == "__main__":
    main()
