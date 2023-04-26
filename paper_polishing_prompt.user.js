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
                    '/version': '请提供多个版本供参考。',
                    '/logical': '请帮助分析并优化这个论点的逻辑结构，以使其更具说服力。',
                    '/consistency': '请阅读并润色整篇论文，确保一致性和连贯性。'
                },
                en: {
                    '/version': 'Please provide multiple versions for reference.',
                    '/logical': 'Please help me analyze and optimize the logical structure of this argument to make it more convincing.',
                    '/consistency': 'Please read and polish the entire paper to ensure consistency and coherence.'
                }
            },
            writing: {
                zh: {
                    '/version': '请提供多个版本供参考。',
                    '/logical': '请帮助分析并优化这个论点的逻辑结构，以使其更具说服力。',
                    '/consistency': '请阅读并润色整篇论文，确保一致性和连贯性。'
                },
                en: {
                    '/version': 'Please provide multiple versions for reference.',
                    '/logical': 'Please help me analyze and optimize the logical structure of this argument to make it more convincing.',
                    '/consistency': 'Please read and polish the entire paper to ensure consistency and coherence.'
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
