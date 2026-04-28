const page = {
    obj: {
        about: document.getElementById("aboutScreen"),
        check: document.getElementById("checkScreen"),
        next: document.getElementById("nextArrow"),
        prev: document.getElementById("prevArrow"),
        question: document.getElementById("question"),
    },
    answers: {
        1: [0, 0],
        2: [0, 0],
        3: 0,
        4: [0, 0],
        5: 0,
        6: 0,
        7: [0, 0, 0, 0],
    },
    question: 1,
    answered: [0, 0, 0, 0, 0, 0, 0],
    finalQuestion: 8,
};

document.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    e.preventDefault(); // Stops tab behavior (it demolishes the page)
  }
});

function fallingStar() {
    let screen = document.getElementById("titleScreen");
    let color = Math.floor(Math.random() * 4);
    let speed = Math.floor(Math.random() * 4);
    for (let i = 0; i < 19; i++) {
        let a = document.createElement("div");
        screen.appendChild(a);
        a.outerHTML = "<div class='fallingStar' style='left: " + ((i + 1) * 5 - 0.5) + "vw; height: " + [21, 24, 27, 30][(speed + i) % 4] + "vh; animation: fallingStar " + [20, 16, 12, 10][(speed + i) % 4] + "s linear " + (i % 6 + (Math.floor(Math.random() * (i % 3) + 2) * 0.5)) + "s infinite, bgColorShift 10s linear " + (0.1 * i) + "s infinite; background-color: var(--a-" + ["blue", "purple", "red", "yellow"][(color + i) % 4] + "); opacity: " + [0.15, 0.2, 0.25][i % 3] + ";'></div>";
    }
};
fallingStar();

function changeQuestion(n) {
    if (!(n === 0 && page.question === 1) && !(n === 1 && page.question === page.finalQuestion) && !(n === 1 && page.answered[page.question - 1] === 0)) {
        document.getElementById("Q" + page.question).style.top = [100, -100][n] + "vh";
        page.question += [-1, 1][n];
        document.getElementById("Q" + page.question).scrollTo(0, 0);
        document.getElementById("Q" + page.question).style.top = 0;
    }
    updateArrows();
    if (page.question === page.finalQuestion) {results()};
}

function updateArrows() {
    page.question != 1 ? page.obj.prev.classList.add("active") : page.obj.prev.classList.remove("active");
    page.answered[page.question - 1] === 1 ? page.obj.next.classList.add("active") : page.obj.next.classList.remove("active");
}

function check(ans, q, a, i) {
    let elem = document.querySelector("#" + ans.id + ">.check>div");
    if (elem.style.opacity === "1") {
        elem.style.opacity = 0;
        a = 0;
    } else {elem.style.opacity = 1};
    i == null ? page.answers[q] = a : page.answers[q][i] = a;
    answer(q);
    updateArrows();
}

function uncheck(arr) {
    arr.forEach((id) => {document.querySelector("#" + id + ">.check>div").style.opacity = 0});
}

function twoPart(q) {
    let reveal = 0;
    if (page.answers[q][0] === 1) {reveal++};
    document.querySelector("#Q" + q + ">.twoPart").style.display = ["none", "block"][reveal];
};

function answer(n) {
    if (page.answered[n - 1] === 0) {page.answered[n - 1] = 1};
    switch ([1, 2, 0, 1, 0, 0, 3][n - 1]) {
        case 1:
            if ((page.answers[n][0] === 1 && page.answers[n][1] === 0) || page.answers[n][0] === 0) {page.answered[n - 1] = 0};
            break;
        case 2:
            if (page.answers[n][0] === 0 || page.answers[n][1] === 0) {page.answered[n - 1] = 0};
            break;
        case 3:
            let ok = false;
            page.answers[n].forEach((v) => {if (v != 0) {ok = true}});
            if (!ok) {page.answered[n - 1] = 0};
            break;
        default:
            if (page.answers[n] === 0) {page.answered[n - 1] = 0};
            break;
    }
}

function results() {
    //determine the likelihood of misinformation (between -2 and 16; -2 - 4: high; 5 - 7: medium; 8 - 10: low; 11 - 16: very low;)
    let chance = 0;
    [[1, 2, 0, -1], [1, 1, 0, 2], [1, 1, 1, 2], [2, 1, 0, 1], [2, 2, 1, -1], [2, 4, 1, 3], [3, 2, 2], [3, 3, 3], [4, 1, 0, 2], [4, 1, 1, 2], [5, 2, 3], [6, 1, -1], [6, 2, 2], [6, 3, 3], [6, 4, 2], [6, 5, 1], [7, 1, 0, 1], [7, 1, 1, 3], [7, 1, 3, -1]].forEach((v) => {
        if (v.length === 4) {
            if (page.answers[v[0]][v[1]] === v[2]) {chance += v[3]}
        } else if (page.answers[v[0]] === v[1]) {chance += v[2]}
    });
    console.log(chance);
    if (chance >= 11) {chance = 0} else if (chance >= 8) {chance = 1} else if (chance >= 5) {chance = 2} else {chance = 3};
    document.querySelector("#Q8>#smallTitle>span").innerHTML = ["Very Low", "Low", "Medium", "High"][chance];
    document.querySelector("#Q8>#question").innerHTML = [
        "It is unlikely that this source is misnformation. The answers given point to it being very trustworthy.",
        "There is a small chance that this source is misinformation or biased. It seems quite trustworthy, however, you should use your best judgement.",
        "There is a notable likelihood that this source is misinformation or untrustworthy. Treat the information given in this source with skepticism.",
        "There is a very high chance that this source is misinformation. The answers given suggest this source is very unreliable or untrustworthy."
    ][chance];

    //explain the implications of each question's answer
    document.querySelector("#Q8>.Q8Para>.q1>.implicit").innerHTML = [
        "you said the author/creator of the source was listed" + [
            " and some amount of information was provided about them. The person providing a source can be a major indicator in whether a source is trustworthy or not, and any additional information provided about them makes that process easier. Lack of an attributed author can be a notable indicator of misinformation, but even when the author is attributed, it's important to consider their credentials.",
            ", but no information was provided about them. The person providing a source can be a major indicator in whether a source is trustworthy or not, and any additional information provided about them makes that process easier. Lacking information about the author isn't uncommon, so a source can't be judged on this fact alone, however, not attributing an author altogether can be a notable indicator of misinformation."
        ][page.answers[1][1] - 1],
        "you said the author/creator of the source was not listed. Lacking attribution to an author or creator isn't enough to say whether something is misinformation or not, but it does count as a red flag to be cautious of. When the author or creator is attributed, it can always help to check their credentials, but when they aren't, there's no way to know the creator's qualifications."
    ][page.answers[1][0] - 1];
    document.querySelector("#Q8>.Q8Para>.q2>.implicit").innerHTML = [
        "you said the author was very professional. Trustworthy sources are often more professional compared to those spreading misinformation, so the professionalism of the author/creator of a source is a good sign.",
        "you said the author lacked professionalism. Sources spreading misinformationtend to be less professional compared to trustworthy sources, so an author/creator lacking professionalism could be a red flag."
    ][page.answers[2][0] - 1] + [
        " You also answered that you were unsure of how well educated the author is. Generally, any credentials or proof of the author's expertise goes a long way in validating a source. Similarly, if the author has credentials completely unrelated to the topic (such as a financial advisor giving health advice), that makes a source less trustworthy.",
        " You also answered that the author did not seem well educated on the source's topic. Generally, any credentials or proof of the author's expertise goes a long way in validating a source. Similarly, if the author has credentials completely unrelated to the topic (such as a financial advisor giving health advice) or if they lack credentials altogether, that makes a source less trustworthy.",
        " You also answered that the author seemed well educated in fields unrelated to the source's topic. Generally, any credentials or proof of the author's expertise goes a long way in validating a source. Similarly, if the author has credentials completely unrelated to the topic (such as a financial advisor giving health advice), that makes a source less trustworthy.",
        " You also answered that the author seemed well educated on the source's topic. Generally, any credentials or proof of the author's expertise goes a long way in validating a source. Similarly, if the author has credentials completely unrelated to the topic (such as a financial advisor giving health advice), that makes a source less trustworthy."
    ][page.answers[2][1] - 1];
    document.querySelector("#Q8>.Q8Para>.q3>.implicit").innerHTML = [
        "you said you were unable to find additional sources covering the topic of your original source. The more sources that cover the same topic, the less likely it is that the topic is false or fake. A lack of additional sources can be a large sign of misinformation.",
        "you said you were able to find additional sources covering the topic of you original source, but the information provided was different. The more sources that cover the same topic, the less likely it is that the topic is false or fake. If multiple sources provide different information, it's likely means that the topic is real, but bias or uncertainty has led to multiple different stories.",
        "you said you were able to find additional sources covering the topic of you original source. The more sources that cover the same topic, the less likely it is that the topic is false or fake. Multiple sources on a topic sharing the same information is a great sign that the sources are truthful and real."
    ][page.answers[3] - 1];
    document.querySelector("#Q8>.Q8Para>.q4>.implicit").innerHTML = [
        "you said the source quoted experts/other sources or used statistics from studies " + [
            " and the quotes or statistics had citations. Quoting other sources, studies, or experts is a sign of a trustworthy source, and when those additional sources are cited, it's an even greater sign.",
            ", but the quotes or statistics did not have citations. Quoting other sources, studies, or experts is a sign of a trustworthy source, but lacking citations can raise suspicions of whether those additional sources are real or just misinformation."
        ][page.answers[4][1] - 1],
        "you said the source did not quote experts/other sources or use statistics from studies. A source doesn't need to quote other sources to be reliable or true, but in many cases, additional sources make it easier to validate the claims of the source."
    ][page.answers[4][0] - 1];
    document.querySelector("#Q8>.Q8Para>.q5>.implicit").innerHTML = [
        "you said there were no additional sources or they were not cited. A source doesn't need additional sources to be reliable or truthful, but when a source does have additional sources, it's important to think about how trustworthy those sources are.",
        "you said additional sources cited seemed reputable. Briefly viewing additional sources cited by the source you're checking goes a long way, as reputable sources tend to cite other reputable sources.",
        "you said additional sources cited did not seem reputable. Briefly viewing additional sources cited by the source you're checking goes a long way, as irreputable sources tend to cite other irreputable sources."
    ][page.answers[5] - 1];
    document.querySelector("#Q8>.Q8Para>.q6>.implicit").innerHTML = [
        "you said the source was published on a social media platform. Social media is one of the most common platforms for the spread of misinformation; there are very few fact-checking measures, if any, which means false claims spread easily.",
        "you said the source was published through a newspaper, news site, or other news channel. Many news outlets have in-house fact checkers, and most news companies are dedicated to sharing real stories that can be backed up by evidence. While the stories they share are likely true, news outlets may be biased on many topics, which means checking multiple different sources is very important to fully understand a given topic.",
        "you said the source was published through an academic publication. Most academic publications like studies and research papers are carried out by professionals and experts in the topic field, and are also peer-reviewed and fact checked. Still, it's important to find more than one source on the topic to make sure their claims and results are reproducable and realistic.",
        "you said the source was published through a physical medium such as a book or magazine. Many physical publishing mediums are held to standards of professionalism and fact-checking, though not all. When it comes to physical publishing, be sure to check who the author is and what their credentials are.",
        "you said the source was published through a forum/discussion. Forums are typically places where many experienced individuals gather to discuss ideas and answer questions. Forums are places where many different ideas are expressed, which allows the members to fact check each other, or at the very least, present different viewpoints on given topics. As long as the topic of the forum/discussion aligns with the topic of your source, it's quite trustworthy, though you may have to do more work to evaluate what claims are right and wrong.",
        "you said the source was self-published, such as through a blog post or personal website. While a self-published source isn't necessarily bad, it's very important to understand who the author is and what their credentials are. If they seem to be an expert in the topic they're discussing and they cite trustworthy sources, self-published sources can be reliable."
    ][page.answers[6] - 1];
    let qSeven = [
        "",
        "You said a purpose was to persuade or convince you of something. Argumentative or persuasive sources try to convince the audience of something through appeals to logic, emotions, etc. If the source's arguments are backed by logic, statistics, or expert opinions, it's a good sign of a trustworthy source. On the other hand, if the source appeals to your emotions without providing many logical arguments, that's a sign of a biased or untrustworthy source. "
    ][page.answers[7][0]];
    qSeven += [
        "",
        "You said a purpose was to inform or educate you on a topic. Trying to inform or educate the audience is a good sign of a trustworthy source. If the source's claims are backed up by other sources and experts, the source is likely to be trustworthy. "
    ][page.answers[7][1]];
    qSeven += [
        "",
        "You said a purpose was to provide entertaining content. While a reliable source can be entertaining as well, if the sole purpose of a source is to provide entertaining content, it raises concerns as to its validity. However, many sources are designed to be both entertaining and informational, and the more informational the source, the more reliable it may be. "
    ][page.answers[7][2]];
    qSeven += [
        "",
        "You said a purpose was to sell you a product or service. If the main purpose of a source is to sell your a product or service, or to convince your of a product's merits, it's usually a sign of a biased or unreliable source. Of course it's possible for the source to provide true information, but with a purpose of selling something, this purpose is a major red flag."
    ][page.answers[7][3]];
    document.querySelector("#Q8>.Q8Para>.q7>.implicit").innerHTML = qSeven;
}

function reset() {
    document.querySelectorAll(".check>div").forEach((v) => {v.style.opacity = 0});
    page.answers = {
        1: [0, 0],
        2: [0, 0],
        3: 0,
        4: [0, 0],
        5: 0,
        6: 0,
        7: [0, 0, 0, 0],
    };
    page.question = 1;
    page.answered = [0, 0, 0, 0, 0, 0, 0];
    twoPart(1);
    twoPart(4);
    document.getElementById("Q1").style.top = 0;
    for (let i = 2; i <= 8; i++) {document.getElementById("Q" + i).style.top = "100vh"};
    updateArrows();
}
