/**
 * @fileoverview Contacts dialogflow and returns response.
 */
const dialogflow = require('dialogflow');
const jsonToProto = require('./json_to_proto')
module.exports = class DialogflowSessionClient {

    constructor(projectId){
        this.sessionClient = new dialogflow.SessionsClient();
        this.projectId = projectId;
    }

    constructRequest(text, sessionPath, payload) {
        return {
            session: sessionPath,
            queryInput: {
                text: {
                    text: text,
                    languageCode: 'en'
                }
            },
            queryParams: {
                payload: jsonToProto.jsonToStructProto(payload)
            }
        };
    }

    constructRequestWithStartContext(text, sessionPath, contexts) {
        console.log(contexts);

        contexts.map(context => {context.lifespanCount = 0;});

        let notUserContext = Object.assign({}, contexts[0]);
        notUserContext.name = notUserContext.name.split("/").slice(0, -1).join('/') + '/userreg_ask_new_user';
        notUserContext.lifespanCount = 5;

        contexts.push(notUserContext);
        console.log(contexts);

        return {
            session: sessionPath,
            queryInput: {
                text: {
                    text: text,
                    languageCode: 'en'
                }
            },
            queryParams: {
                contexts: contexts,
                resetContexts: true
            }
        };
    }

    constructRequestWithEvent(eventName, sessionPath) {
        return {
            session: sessionPath,
            queryInput: {
                event: {
                    name: eventName,
                    languageCode: 'en'
                },
            },
        };
    }

    //This function calls Dialogflow DetectIntent API to retrieve the response
    //https://cloud.google.com/dialogflow/docs/reference/rest/v2/projects.agent.sessions/detectIntent
    async detectIntentHelper(detectIntentRequest) {
        let [response] = await this.sessionClient.detectIntent(detectIntentRequest);
        return (response.queryResult);
    }

    async detectIntent(text, sessionId, payload) {
        const sessionPath = this.sessionClient.sessionPath(
            this.projectId, sessionId); // path is = "projects/<Project ID>/agent/sessions/<Session ID>"
        const request = this.constructRequest(text, sessionPath, payload);
        //const request = this.constructRequest(text, "projects/<Project ID>/agent/sessions/" + sessionId.toString(), payload);
        return await this.detectIntentHelper(request);
    }

    async detectIntentWithStartContext(text, sessionId, contexts) {
        const sessionPath = this.sessionClient.sessionPath(
            this.projectId, sessionId);
        const request = this.constructRequestWithStartContext(text, sessionPath, contexts);
        console.log(await this.detectIntentHelper(request));
    }

    async detectIntentWithEvent(eventName, sessionId) {
        const sessionPath = this.sessionClient.sessionPath(
            this.projectId, sessionId);
        const request = this.constructRequestWithEvent(
            eventName, sessionPath);
        return await this.detectIntentHelper(request);
    }
};