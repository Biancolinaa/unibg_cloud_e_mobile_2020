const connectToDb = require('./db');
const speaker = require('./speaker.schema');

const getSpeakerByName = async (name) => {
    await connectToDb();
    const s = await speaker.find({ main_speaker: new RegExp(name, 'i') });
    return s;
}

const handler = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    
    const { name } = event.queryStringParameters || {};
    
    if (!name) {
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Missing name.'
        });
    }
    
    try {
        const s = await getSpeakerByName(decodeURIComponent(name));
        if (!s) {
            callback(null, {
                statusCode: 404,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Speaker not found.'
            });
        } else {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(s)
            });
        }
        
    } catch (e) {
        callback(null, {
            statusCode: 500,
            headers: { 'Content-Type': 'text/plain' },
            body: e.message
        });
    }
}

exports.handler = handler;