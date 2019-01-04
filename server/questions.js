var Question = function (id, heading, question, answers, hintText, hintDelay) {
    this.id = id;
    this.heading = heading;
    this.text = question;
    this.answers = (Array.isArray(answers) ? answers : [answers]);
    this.hint = {
        available: (hintText != null && hintDelay != null),
        text: hintText,
        delay: hintDelay,
        time: 0
    }
};

var q = [
    new Question('79f41b45-2dd9-4e2d-950a-d48b0c2a1679', 'Casova kalibrace majaku', 'Jake je dnes datum? (format napr. 1.6.2018)', ['3.8.2018','3. 8. 2018'], 'Na expedici jste vyrazeli 29.7.', 10),
    new Question('4e423762-8305-40e5-b228-23b1bef29d7a', 'Casova kalibrace majaku', 'Jaky je den v tydnu?', ['patek', 'pátek']),
    new Question('e2d9b08b-8437-44fe-aa9f-5045d4e99995', 'Test spoluprace', 'Zadejte tajne heslo vzdalene 400 m pod azimutem 285 od majaku ve vysce 2,5 m', 'vakuum'),
    new Question('dc17171c-eabf-4caa-88af-222d11d9abec', 'Test archeologie', 'V kolikatem patre se v mistni nemocnici nachazela neurochirurgie? (zadejte jenom cislo)', ['8', '8.'],
        'Podivejte na mapu, podle ktere jste nasli majak!', 10),
    new Question('080838e1-8e88-4140-b95a-ba11a7b63919', 'Test pozornosti', 'Jaka je kapacita parkoviste? (zadejte jenom cislo)', '12', 'Podivejte na mapu, podle ktere jste nasli majak!', 10),
    new Question('d2d2a509-778f-42aa-aea5-fe523a99ec05', 'Test duvtipnosti', 'Jak se jmenuje artefakt nachazejici se pobliz Smrdute Jamy?', 'ringo', 'Kde to tady v okoli nejvic smrdi?', 5),
    new Question('b6c31401-0588-48fc-88da-1ffc7d07d6a9', 'Test odvozovani', 'Pobliz se drive nachazelo zarizeni pro vedeni vody nad povrchem planety. Zjistete, jak se toto zarizeni jmenuje v madarstine.',
        ['vízvezeték','vizvezetek'], 'Vzpominate, kde byl loni akvadukt? A vite, co to je Rossetska deska? Ta obsahovala stejnou zpravu ve trech jazycich.', 10),
    new Question('72b843dc-fc92-41a2-82b4-346ec1513ca5', 'Test sifrovani', 'Majak vysila zasifrovane heslo. Jake?', ['svetelny rok', 'světelný rok'], 'Podivejte se na majak. Blika morseovku. Jeden at hlasi tecka/carka/mezera, druhy at pise.', 10),
    new Question('e5f82dc5-82ed-4ec2-8164-7874756faf13', 'Test rodneho jazyka', 'Napiste slovo (je to rostlina), ktere ziskate preskladanim pismen v nasledujici presmycce: KRTCI LEP', ['petrklic', 'petrklíč'], 
    'Je to jedna z prvnich rostlin kvetoucich na jare v Cesku na planete Zemi. Zacina na P.', 5),
    new Question('18405cb9-d21b-491b-b5f3-4ee41227b5d1', 'Test rodneho jazyka', 'Napiste slovo (je to ptak), ktere ziskate preskladanim pismen v nasledujici presmycce: DUSOT KAPRA', 'strakapoud',
        'Tento ptak zije v Cesku, nejcasteji v lesich, splha po stromech.', 5),
    new Question('077b9904-8db9-4279-aced-bc3bba3c5cb5', 'Test rodneho jazyka', 'Napiste slovo (je to exoticky ptak), ktere ziskate preskladanim pismen v nasledujici presmycce: OBRI KLIK', ['kolibrik', 'kolibřík'],
        'Tento ptak je opravdu, ale OPRAVDU drobny.', 5),
    new Question('2e4a564f-e05d-4376-8425-485914420652', 'Test matematiky', 'Sectete vsechna cisla od 1 do 100. (Je to chytak!)', '5050', 'Nescitejte je vsechny! 1 + 100= ???, 2 + 99 = ??? a kolik takovych dvojic celkem je?', 3)
];

// to shuffle the questions for each of the teams differently
// the numbers in the arrays reffer to the indexes in the "q" array above (not the question IDs)
var teams = {
    mars:    [0, 1, 2, 8, 5, 9, 11, 4, 6, 10, 3, 7],
    neptun:  [0, 1, 5, 6, 2, 4, 8, 11, 3, 7, 9, 10],
    jupiter: [0, 1, 7, 8, 9, 6, 3, 2, 5, 11, 4, 10],
    merkur:  [0, 1, 8, 9, 3, 11, 10, 7, 4, 2, 6, 5],
    saturn:  [0, 1, 3, 4, 7, 8, 5, 6, 11, 9, 10, 2]
};

var prepareQuestion = function(q) {
    
    var qtr = {
        id: q.id,
        heading: q.heading,
        text: q.text
    }

    if (q.hint.available) {
        qtr.hint = {
            available: true,
            //time: (new Date()).getTime() + (q.hint.delay * 60 * 1000),
            // the server can have incorrect system date - we set the time here to far future so the hint is not displayed immediately,
            // the frontent then computes the real time of display based on the delay
            time: new Date(2028,7,3,0,0,0),
            text: q.hint.text,
            delay: q.hint.delay
        };
    }
    return qtr;
};

exports.getQuestion = function (query) {
    
    var team = query.team;

    if (query.team == null) {
        return null;
    }

    team = team.toLowerCase();

    if (teams[team] == null) {
        return null;
    }


    if (query.question == null) {
        // asking for the first question
        return prepareQuestion(q[teams[team][0]]);
    }
    // there is a question that was answered
    // the request contains the id of the question, not the order in the array for the team

    // we have to look up in the array to find the next question
    var answeredQuestionIndex = teams[team].findIndex(function(element) { return q[element].id == query.question });
    if(answeredQuestionIndex == -1) {
        // invalid question ID
        console.log('invalid question ID: ' + query.question);
        return null;
    }
    var aQ = q[teams[team][answeredQuestionIndex]];
    console.log('The answered question was found: ' + JSON.stringify(aQ));
    if (query.answer == null || !aQ.answers.includes(query.answer.toLowerCase())) {
        // no answer or wrong answer - returning the same question
        console.log('no answer or wrong answer - returning the same question: ' + query.answer);
        return prepareQuestion(aQ);
    }
    //there is a correct answer, moving to the next question
    var newQ = q[teams[team][answeredQuestionIndex + 1]];
    // checking if we are not ot of bounds
    if (newQ) {
        console.log('There is a next question available: ' + JSON.stringify(newQ));
        return prepareQuestion(newQ);
    } else {
        // end of the game - the last question was answered!
        console.log('This is the end...');
        return {
            id: 'END',
            text: 'Vyborne, prosli jste testem. Majak overil, ze jste inteligentni bytosti. Stisknete tlacitko a vyslechnete nahranou zpravu.',
            link: 'end.mp3',
            timestamp: (new Date()).getTime()
        };
    }

}