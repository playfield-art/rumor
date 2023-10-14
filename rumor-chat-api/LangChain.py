import os
import openai
from langchain.chains import ConversationalRetrievalChain, RetrievalQA
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import DirectoryLoader, TextLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.indexes import VectorstoreIndexCreator
from langchain.indexes.vectorstore import VectorStoreIndexWrapper
from langchain.llms import OpenAI
from langchain.vectorstores import Chroma

from config import openai_api_key

# Set the OpenAI key in the environment
os.environ["OPENAI_API_KEY"] = openai_api_key

def getIndex(persist=True):
  if persist and os.path.exists("persist"):
    print("Reusing index...\n")
    vectorstore = Chroma(persist_directory="persist", embedding_function=OpenAIEmbeddings())
    index = VectorStoreIndexWrapper(vectorstore=vectorstore)
  else:
    loader = DirectoryLoader("data/")
    if persist:
      index = VectorstoreIndexCreator(vectorstore_kwargs={"persist_directory":"persist"}).from_loaders([loader])
    else:
      index = VectorstoreIndexCreator().from_loaders([loader])
  return index

# create the index
index = getIndex(True)

# create a LongChain chain
chain = ConversationalRetrievalChain.from_llm(
  llm=ChatOpenAI(model="gpt-3.5-turbo"),
  retriever=index.vectorstore.as_retriever(search_kwargs={"k": 1}),
)

chat_history = []
def prompt(question):
  return index.query(question)
  #result = chain({"question": question, "chat_history": chat_history})
  #chat_history.append((question, result['answer']))
  #return result['answer']
