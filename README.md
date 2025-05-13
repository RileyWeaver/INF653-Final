# INF653 - Backend 1 Final Project

This project is to showcase what I have learned with Node.js, Express, and MongoDB by 
building a RESTful API around U.S. states data.

Get all US states data (from JSON file, merged with MongoDB fun facts)
Filter for contiguous or non-contiguous states
Get state details by abbreviation 
Get, add, update, and delete fun facts for states
Get state capital, nickname, population, and admission date
Friendly error messages and 404 handling

# Prerequisites

Node.js
MongoDB Atlas or local MongoDB instance

[<img src="https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix-button.svg" width="163px" />]
(https://glitch.com/edit/#!/import/github/RileyWeaver/ING653-Final)

**Deploy by clicking the button above**

# A few things you can do with this

GET Endpoints
/states/ --Returns all state data (merged with fun facts from MongoDB).
/states/?contig=true --Returns all contiguous states (excludes AK, HI).
/states/?contig=false --Returns only non-contiguous states (AK, HI).
/states/:state --Returns all data for the state with the given abbreviation.
/states/:state/funfact --Returns a random fun fact for the state.
/states/:state/capital --Returns the state capital.
/states/:state/nickname --Returns the state nickname.
/states/:state/population --Returns the state population (as a string with commas).
/states/:state/admission --Returns the state admission date.

POST Endpoints
/states/:state/funfact --Add one or more fun facts to a state.
  { "funfacts": ["Fact 1", "Fact 2"] }

PATCH Endpoints
/states/:state/funfact --Description: Update a fun fact at a specific index.
  { "index": 1, "funfact": "Updated fun fact." }

DELETE Endpoints
/states/:state/funfact --Delete a fun fact at a specific index.
  { "index": 1 }


