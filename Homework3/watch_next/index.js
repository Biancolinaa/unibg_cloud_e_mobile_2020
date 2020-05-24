const connectToDb = require('./db');
const talk = require('./talk.schema');

const findTalkById = (cols) => (id) => talk.findById(id,cols);


const getWatchNextByIdx = async (idx) => {
    await connectToDb();
    const t = await talk.findById(idx, 'watch_next');
    return t ? t.watch_next : null;
}

const getWatchNextByIdxWithInfo = async (idx) => {
   const watchNextIds = await getWatchNextByIdx(idx);
   if (!watchNextIds) {
       return null;
   }
   const watchNextTalks = await Promise.all(watchNextIds.map(findTalkById('-watch_next -details -tags')));
   return watchNextTalks;
}

const handler = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    
    const { idx: id } = event.queryStringParameters || {};
    
    if (!id) {
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Missing id.'
        });
    }
    
    try {
        const watchNextTalks = await getWatchNextByIdxWithInfo(id);
        if (!watchNextTalks) {
            callback(null, {
                statusCode: 404,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Id not found.'
            });
        } else {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(watchNextTalks)
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