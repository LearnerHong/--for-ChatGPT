// ==UserScript==
// @name         论文润色提示词 for ChatGPT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在ChatGPT页面上提供论文润色提示词
// @author       Your Name
// @match        https://*/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    const inputElement = document.querySelector('input[type="text"], textarea');
    document.querySelector(inputSelector).addEventListener('keyup', (event) => {
    const inputElement = event.target;
    const cursorPosition = inputElement.selectionStart;
    const inputValue = inputElement.value.slice(0, cursorPosition);

    for (const key in prompts) {
        if (inputValue.endsWith(key)) {
            const beforeKey = inputValue.slice(0, cursorPosition - key.length);
            const afterKey = inputElement.value.slice(cursorPosition);
            inputElement.value = beforeKey + prompts[key] + afterKey;
            inputElement.selectionStart = cursorPosition - key.length + prompts[key].length;
            inputElement.selectionEnd = cursorPosition - key.length + prompts[key].length;
            break;
        }
    }
    });

    if (inputElement) {
        GM_addStyle('.prompt-selector { position: absolute; top: 0; left: -200px; z-index: 1000; }');

        const promptSelectorDiv = document.createElement('div');
        promptSelectorDiv.className = 'prompt-selector';
        inputElement.parentElement.appendChild(promptSelectorDiv);

        const categorySelector = document.createElement('select');
        categorySelector.innerHTML = '<option value="interview">面试</option><option value="writing">写作</option>';
        promptSelectorDiv.appendChild(categorySelector);

        const languageSelector = document.createElement('select');
        languageSelector.innerHTML = '<option value="zh">中文</option><option value="en">英文</option>';
        promptSelectorDiv.appendChild(languageSelector);

        const promptSets = {
            interview: {
                zh: {
                    '/回答': '你现在是一个有着多年经验的阿里巴巴Java高级工程师，如果你遇到下面这个面试问题，请问你怎么回答，请示范。',
                    '/讲解': '你现在是一个有着多年经验的阿里巴巴Java高级工程师，请你由浅入深、用通俗易懂的语言给我讲讲这个知识点。',
                    '/出题': '你现在是一个有着多年经验的阿里巴巴Java高级工程师，请你针对这个知识点，出几点可能的面试问题，并给出你认为出色的回答。'
                },
                en: {
                    '/回答': 'You are now a senior Java engineer with many years of experience at Alibaba. If you encounter the following interview question, how would you answer it? Please demonstrate.',
                    '/讲解': 'You are now a senior Java engineer with many years of experience at Alibaba. Please explain this concept to me in simple and easy-to-understand language, starting from the basics.',
                    '/出题': 'You are now a senior Java engineer with many years of experience at Alibaba. Please come up with several interview questions based on this topic and provide what you consider to be excellent answers.'
                }
            },
            writing: {
                zh: {
                    '/版本': '请提供多个版本供参考。',
                    '/逻辑': '请帮助分析并优化这个论点的逻辑结构，以使其更具说服力。',
                    '/一致性': '请阅读并润色整篇论文，确保一致性和连贯性。'
                },
                en: {
                    '/版本': 'Please provide multiple versions for reference.',
                    '/逻辑': 'Please help me analyze and optimize the logical structure of this argument to make it more convincing.',
                    '/一致': 'Please read and polish the entire paper to ensure consistency and coherence.'
                }
            }
        };

        inputElement.addEventListener('input', (event) => {
            const category = categorySelector.value;
            const language = languageSelector.value;
            const inputValue = event.target.value;

            if (inputValue in promptSets[category][language]) {
                inputElement.value = promptSets[category][language][inputValue];
                event.preventDefault();
            }
        });
    } else {
        console.error('Chat input element not found.');
    }
})();
