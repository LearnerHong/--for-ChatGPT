// ==UserScript==
// @name         论文润色提示词 for ChatGPT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在ChatGPT页面上提供论文润色提示词
// @author       Your Name
// @match        https://*/*
// @grant        none
// @updateURL https://raw.githubusercontent.com/LearnerHong/Paper-polishing-for-ChatGPT/main/paper_polishing_prompt.user.js
// @downloadURL https://raw.githubusercontent.com/LearnerHong/Paper-polishing-for-ChatGPT/main/paper_polishing_prompt




// ==/UserScript==

(function() {
    'use strict';

    const inputSelector = 'input[type="text"], textarea';// 根据ChatGPT页面的实际情况填写

    const prompts = {
        '/version': 'Please provide multiple versions for reference.',
        '/logical': 'Please help me analyze and optimize the logical structure of this argument to make it more convincing.',
        '/consistency': 'Please read and polish the entire paper to ensure consistency and coherence.'
    };

    document.querySelector(inputSelector).addEventListener('input', (event) => {
        const inputElement = event.target;
        const inputValue = inputElement.value;

        if (inputValue in prompts) {
            inputElement.value = prompts[inputValue];
            event.preventDefault();
        }
    });

})();
