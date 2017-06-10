const answers = {
    idea: 'Mach $ARTICLE $ADJECTIVE $SUBJECT um $OBJECT $PROBLEM'
};

const articles = {
    1: 'einen',
    2: 'eine',
    3: 'eines'
}

export function tellIdea(gender, adjective, subject, object, problem) {
    const article = articles[gender];

    return answers.idea.replace('$ARTICLE', article)
        .replace('$ADJECTIVE', adjective)
        .replace('$SUBJECT', subject)
        .replace('$OBJECT', object)
        .replace('$PROBLEM', problem);
}