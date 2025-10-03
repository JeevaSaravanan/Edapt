import vertexai
from vertexai.preview import rag

# --- Configuration ---
# Your specific GCP project and RAG engine details
PROJECT_ID = "edapt-474000"
LOCATION = "us-east4"
RAG_RESOURCE_NAME = "projects/edapt-474000/locations/us-east4/ragCorpora/576460752303423488"

# --- Initialize Vertex AI ---
vertexai.init(project=PROJECT_ID, location=LOCATION)

def query_rag_engine(user_query: str) -> list[str]:
    """
    Queries the RAG Engine and returns the retrieved contexts as a list of strings.

    Args:
        user_query: The question from the user.

    Returns:
        A list of content strings from the retrieved documents.
    """
    try:
        # Perform the retrieval from the RAG engine
        response = rag.retrieve(
            rag_resource_name=RAG_RESOURCE_NAME,
            text=user_query,
            query_config=rag.QueryConfig(vector_distance_threshold=0.5, top_k=5)
        )

        # Extract just the text content from the response
        retrieved_contexts = [doc.text for doc in response.documents]
        print(f"Successfully retrieved {len(retrieved_contexts)} contexts from RAG engine.")
        return retrieved_contexts

    except Exception as e:
        print(f"An error occurred while querying the RAG engine: {e}")
        return []