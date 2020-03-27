# Housing_Grants

## Language and Frameworks
javascript, mysql, sequelize, node.js, express

## Instructions to install:
1. Git clone the files to a folder.
2. **npm install** to install the dependencies.
3. Open mySQL workbench and create a connection using 'localhost', port 3306, username: 'root', password: 'password'.
4. Create a new schema named 'housing-grants'. **you just need a schema with this name. No need to create tables**
5. Upon npm run start, the database connection will be established/authenticated and the tables will be created by Sequelize.

## Accessing the endpoints:
Postman scripts have been uploaded too, giving a sample of how to send HTTP requests. 

## Sample Data:
mysql table data has been uploaded. You can load it into mysql workbench to avoid manual entry of data.

## Assumptions about the assignment.

1. In creating the households or adding members, the controllers expect the request body to contain the full spelling of the housing type, gender, marital status or occupation type. 

2. We assume only two genders (male and female), and two marital statuses (single and married)
3. To reduce storage space, we store all enum types as characters because Sequelize does not support mysql enum type. 
    <br/> HouseholdType:  'L' --> 'Landed',     'C' --> 'Condominium', 'H' --> 'HDB'
    <br/>  Gender:         'M' --> 'Male',       'F' --> 'Female'
    <br/>  Marital:        'S' --> 'Single',     'M' --> 'Married'
    <br/>  OccupationType: 'U' --> 'Unemployed', 'S' --> 'Student', 'E' --> 'Employed'
    <br/>  I decided not to use look-up tables and follow the above rules.
    
4. All results will come with a housing ID (h_id) or member ID (m_id), which are the primary keys.
5. Age of members are with respect to the current Sequelize.NOW date.
6. For the endpoint on grant disbursement, it returns a json containing the households qualifying for each of the 5 grants.
   **I took 'qualifying members' to mean that we want to see only the members who contributed to the requirements of the grants.** Take the Student Encouragement Bonus for example, only the children (<16 YO) of the households are shown. Likewise for Family Togetherness, only the children and members who are living with their spouses are shown. The exception is the YOLO GST Grant which returns all members of the household. 
7. The housing grant endpoint accepts three search parameters: Household size, Total income and Type of Housing.
   It returns only households whoze size and income **are less than the specified params**, and fits the type of housing. 
   These are additional search criteria to the existing grant requirements.
    
