```text
  DEBUG ─ Resolving the template's static variables.
  DEBUG ─ Collecting components from the template.
  DEBUG ─ Downloading any NPM components found in the template.
  DEBUG ─ Analyzing the template's components dependencies.
  DEBUG ─ Creating the template's components graph.
  DEBUG ─ Syncing template state.
  DEBUG ─ Executing the template's components graph.
  DEBUG ─ Compressing function myRestAPI file to /Users/dfounderliu/Desktop/restAPI/component/.serverless/myRestAPI.zip.
  DEBUG ─ Compressed function myRestAPI file successful
  DEBUG ─ Uploading service package to cos[sls-cloudfunction-ap-singapore-code]. sls-cloudfunction-default-myRestAPI-1574856533.zip
  DEBUG ─ Uploaded package successful /Users/dfounderliu/Desktop/restAPI/component/.serverless/myRestAPI.zip
  DEBUG ─ Creating function myRestAPI
  DEBUG ─ Updating code... 
  DEBUG ─ Updating configure... 
  DEBUG ─ Created function myRestAPI successful
  DEBUG ─ Setting tags for function myRestAPI
  DEBUG ─ Creating trigger for function myRestAPI
  DEBUG ─ Starting API-Gateway deployment with name myRestAPI.serverless in the ap-singapore region
  DEBUG ─ Service with ID service-ibmk6o22 created.
  DEBUG ─ API with id api-pjs3q3qi created.
  DEBUG ─ Deploying service with id service-ibmk6o22.
  DEBUG ─ Deployment successful for the api named myRestAPI.serverless in the ap-singapore region.
  DEBUG ─ Deployed function myRestAPI successful

  myRestAPI: 
    Name:        myRestAPI
    Runtime:     Python3.6
    Handler:     index.main_handler
    MemorySize:  128
    Timeout:     20
    Region:      ap-singapore
    Role:        QCS_SCFExcuteRole
    Description: My Serverless Function
    APIGateway: 
      - serverless - service-ibmk6o22-1256773370.sg.apigw.tencentcs.com

  10s › myRestAPI › done

```