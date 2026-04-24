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
        scrollToTop(document.getElementById("Q" + page.question));
        document.getElementById("Q" + page.question).style.top = [100, -100][n] + "vh";
        page.question += [-1, 1][n];
        document.getElementById("Q" + page.question).style.top = 0;
    }
    updateArrows();
    if (page.question === page.finalQuestion) {results()};
}

function scrollToTop(elem) {
    let c = 40;
    let timer = setInterval(() => {
        c--;
        elem.scrollBy(0, -10);
        if (c <= 0) {clearInterval(timer)};
    }, 20);
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
    switch ([1, 2, 0, 1, 0, 0, 0, 3][n - 1]) {
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
    //determine the likelyhood of misinformation
    //explain the implications of each question's answer
    document.querySelector("#Q8>.question>.q1>.implicit").innerHTML = [
        "you said the author/creator of the source was listed" + [
            " and some amount of information was provided about them. The person providing a source can be a major indicator in whether a source is trustworthy or not, and any additional information about them provided makes that process easier. Lack of an attributed author can be a notable indicator of misinformation, but even when the author is attributed, it's important to consider their credentials.",
            ", but no information was provided about them. The person providing a source can be a major indicator in whether a source is trustworthy or not, and any additional information about them provided makes that process easier. Lacking information about the author isn't uncommon, so a source can't be judged on this fact alone, however, not attributing an author altogether can be a notable indicator of misinformation."
        ][page.answers[1][1] - 1],
        "you said the author/creator of the source was not listed."
    ][page.answers[1][0] - 1];
}

function reset() {
    //uncheck all by querySelectorAll-ing the check boxes and making them opacity 0
    //reset all pages.answers values to 0
    //hide all two-part questions & answers
}

/*
Questions:

DONE - Is the author credited? If so, can you find any information on them? (a link to their bio, or a quick google search)

DONE - Is the author a professional in the fields the source relates to?

DONE - Just based on the source, does the story seem believable? Does it make sense? Does the author seem professional, or that they are well educated on this topic?

DONE - Do multiple sources cooberate this fact. The more trustworthy sources you can find, the less likely the story is misinformation. Is the story the same in each source? (a quick search)

DONE - Do they quote experts or use statistics from studies? And do they cite these sources?

DONE - Check their sources. Where did the information come from originally? If you can't find the original source, or the original source isn't very reputable, the story likely isn't either.

DONE - Is the publisher/platform a reliable source of information? (social media vs CNN or something; persuasive vs informative)

DONE - What is the author's purpose? (persuade you, sell you something, inform you, entertain you)
*/
