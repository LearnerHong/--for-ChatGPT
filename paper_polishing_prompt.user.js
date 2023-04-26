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

    const inputSelector = 'input[type="text"], textarea';

    const promptSets = {
        interview: {
            en: {
                '/version': 'Please provide multiple versions for reference.',
                '/logical': 'Please help me analyze and optimize the logical structure of this argument to make it more convincing.',
                '/consistency': 'Please read and polish the entire paper to ensure consistency and coherence.',
            },
            zh: {
                '/version': '请提供多个版本供参考。',
                '/logical': '请帮助我分析和优化这个论点的逻辑结构，使其更具说服力。',
                '/consistency': '请阅读并润色整篇论文，确保一致性和连贯性。',
            },
        },
        writing: {
            en: {
                '/version': 'Please provide multiple versions for reference.',
                '/logical': 'Please help me analyze and optimize the logical structure of this argument to make it more convincing.',
                '/consistency': 'Please read and polish the entire paper to ensure consistency and coherence.',
            },
            zh: {
                '/version': '请提供多个版本供参考。',
                '/logical': '请帮助我分析和优化这个论点的逻辑结构，使其更具说服力。',
                '/consistency': '请阅读并润色整篇论文，确保一致性和连贯性。',
            },
        },
    };

    // 添加选择框到页面
    const selectBox = document.createElement('select');
    selectBox.id = 'prompt-category';
    selectBox.style.position = "fixed";
    selectBox.style.top = "10px";
    selectBox.style.left = "10px";
    selectBox.innerHTML = `
      <option value="interview-en">面试 (英文)</option>
      <option value="interview-zh">面试 (中文)</option>
      <option value="writing-en">写作 (英文)</option>
      <option value="writing-zh">写作 (中文)</option>
    `;
    document.body.appendChild(selectBox);

    const chatInputElement = document.querySelector(inputSelector);

    if(chatInputElement) {
        chatInputElement.addEventListener('input', (event) => {
            const inputElement = event.target;
            const inputValue = inputElement.value;
            const selectedCategory = document.querySelector('#prompt-category').value;
            const [category, language] = selectedCategory.split('-');

            if (inputValue in promptSets[category][language]) {
               inputElement.value = promptSets[category][language][inputValue];
               event.preventDefault();
            }
        });
    } else {
        console.error('Chat input element not found.');
    }
    })();
