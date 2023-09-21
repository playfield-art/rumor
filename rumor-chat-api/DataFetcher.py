import requests
import json
import os
import pandas as pd

from config import settings
from queries import getSessionsQuery, getAmountOfSessionsQuery

##
# Create a directory if it does not already exist.
##
def create_directory_if_not_exists(directory_path):
  """
  Create a directory if it does not already exist.

  Args:
      directory_path (str): The path of the directory to create.

  Returns:
      bool: True if the directory was created or already exists, False otherwise.
  """
  if not os.path.exists(directory_path):
      os.makedirs(directory_path)
      return True
  else:
      return False

##
# Reuse the headers
##
def getHeaders():
  headers = {
    'Authorization': f"Bearer {settings.rumor_cms_api_key}",
    'Content-Type': 'application/json',
  }
  return headers

##
# Get the intro
##
def getIntro():
  with open('intro.txt', 'r') as file:
    return file.read()

##
# Get the amount of sessions
##
def getAmountOfSessions():
  response = requests.post(f"{settings.rumor_cms_url}/graphql", json={'query': getAmountOfSessionsQuery()}, headers=getHeaders())
  if response.status_code == 200:
    return len(response.json()['data']["sessions"]["data"])
  else:
    return 0

##
# Get the session data
##
def getSessionData():
  output = []
  amountOfSessions = getAmountOfSessions()
  for i in range(0, amountOfSessions, 10):
    response = requests.post(f"{settings.rumor_cms_url}/graphql", json={'query': getSessionsQuery(10,i)}, headers=getHeaders())
    if response.status_code == 200:
      for session in response.json()['data']['sessions']['data']:
        currentSession = { 'id': session['id'], 'answers': [] }
        for answer in session['attributes']['answers']:
          questionTags = []
          for questionTag in answer['question']['data']['attributes']['question_tags']['data']:
            questionTags.append(questionTag['attributes']['name'].replace("_", " ").strip().lower())
          currentSession['answers'].append({
            'questionTags': questionTags,
            'answer': answer['moderated_transcript']
          })
        output.append(currentSession)
      else:
        print(f"Request failed with status code {response.status_code}: {response.text}")
  return output

##
# Download session data
##
def downloadSessionData():
  create_directory_if_not_exists("data")
  sessionData = getSessionData()
  for session in sessionData:
    file_path = f"data/{session['id']}.txt"
    with open(file_path, "w") as f:
      f.write(f"{getIntro()}\n\n")
      for answer in session['answers']:
        if(len(answer['questionTags']) > 0):
          f.write(f"Over categorie {', '.join(answer['questionTags'])} weet ik: {answer['answer']}\n")
        else:
          f.write(f"{answer['answer']}\n")
