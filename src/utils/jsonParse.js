const jsonParse = (json) => {
    let parsedJson = null;
    try {
        parsedJson = JSON.parse(json);
    } catch (error) {
        console.warn(error.message);
    }
    return parsedJson;
};

export default jsonParse;
