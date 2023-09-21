def getAmountOfSessionsQuery():
  return """
  {
    sessions(
      filters: { moderated: { eq: true } }
      pagination: { pageSize: 9999 }
    ) {
      data {
        id
      }
    }
  }
  """

def getSessionsQuery(limit = 10, start = 0):
  sessionsQuery = """
    # Write your query or mutation here
    query GetSessions {
      sessions(
        pagination: { limit: {limit}, start: {start} }
      ) {
        data {
          id
          attributes {
            answers(
              pagination: { pageSize: 30 }
            ) {
              question {
                data {
                  attributes {
                    question_tags {
                      data {
                        attributes {
                          name
                        }
                      }
                    }
                  }
                }
              }
              moderated_transcript
            }
          }
        }
      }
    }
  """
  sessionsQuery = sessionsQuery.replace("{limit}", str(limit))
  sessionsQuery = sessionsQuery.replace("{start}", str(start))
  return sessionsQuery