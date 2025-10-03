import vertexai
from vertexai.generative_models import GenerativeModel, Part

# --- LLM Configuration ---
# Use the latest available Gemini Pro model
LLM_MODEL = GenerativeModel("gemini-2.5-pro")

def generate_answer_and_mindmap(query: str, rag_contexts: list[str]) -> tuple[str, str]:
    """
    Generates a user-facing answer and a Mermaid.js mind map using the LLM.
    """
    if not rag_contexts:
        return "I couldn't find any relevant information to answer your question.", ""

    context_string = "\n---\n".join(rag_contexts)

    # The prompt uses {{...}} to escape the curly braces for the f-string, fixing the Pylance error.
    prompt = f"""
    You are an intelligent assistant. Perform two tasks based on the provided context and user query.

    **User Query:**
    "{query}"

    **Retrieved Context:**
    ---
    {context_string}
    ---

    **TASK 1: Generate a concise and helpful answer**
    Based ONLY on the provided context, answer the user's query directly. Do not use any prior knowledge.

    **TASK 2: Generate a Mermaid.js mind map**
    Analyze the retrieved context to identify the main topic, key concepts, and their hierarchical relationships.
    Then, generate a mind map in Mermaid.js syntax.

    **Provide your response in the following format, using '---MindMapSeparator---' as the separator.**

    [Your generated answer for TASK 1]
    ---MindMapSeparator---
    ```mermaid
    mindmap
        root({{_Main_Topic_}})
            (Keyword 1)
                (Sub-keyword 1.1)
            (Keyword 2)
    ```
    """

    try:
        response = LLM_MODEL.generate_content([Part.from_text(prompt)])
        full_response_text = response.text

        if "---MindMapSeparator---" in full_response_text:
            answer, mindmap = full_response_text.split("---MindMapSeparator---", 1)
            return answer.strip(), mindmap.strip()
        else:
            return full_response_text.strip(), "Error: Could not generate mind map."

    except Exception as e:
        print(f"An error occurred during LLM generation: {e}")
        return "I encountered an error while processing your request.", ""