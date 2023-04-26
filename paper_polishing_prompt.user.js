// ==UserScript==
// @name         DIY ChatGPT Prompt
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自定义提示词快捷方式
// @author       江鸟莫凡
// @match        https://*.openai.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    function setupKeyListener(inputElement) {
        if (!inputElement) return;

        const existingListener = inputElement.getAttribute('data-keyup-setup');
        if (existingListener) return;

        inputElement.setAttribute('data-keyup-setup', 'true');

        GM_addStyle('.prompt-selector { position: absolute; top: 0; left: -200px; z-index: 1000; }');

        GM_addStyle('.suggestions-container { position: absolute; top: 100%; left: 0; background-color: #fff; border: 0px solid #ccc; padding: 4px; }');
        GM_addStyle('.suggestions-container.hidden { display: none; }');
        GM_addStyle('.suggestion:hover { background-color: #eee; }');
        GM_addStyle('.suggestion { padding: 4px; cursor: pointer; display: inline-block; }');



        const promptSelectorDiv = document.createElement('div');
        promptSelectorDiv.className = 'prompt-selector';
        inputElement.parentElement.appendChild(promptSelectorDiv);

        const categorySelector = document.createElement('select');
        categorySelector.innerHTML = '<option value="interview">面试</option><option value="writing">写作</option>';
        promptSelectorDiv.appendChild(categorySelector);

        const languageSelector = document.createElement('select');
        languageSelector.innerHTML = '<option value="zh">中文</option><option value="en">英文</option>';
        promptSelectorDiv.appendChild(languageSelector);

        // 添加建议提示词容器
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'suggestions-container';
        inputElement.parentElement.appendChild(suggestionsContainer);


        const promptSets = {
            interview: {
                zh: {
                    '：：回答': '你现在是一个有着多年经验的阿里巴巴Java高级工程师，如果你遇到这个面试问题，请问你怎么回答才能赢得面试官的青睐，请现场示范。',
                    '：：讲解': '你现在是一个有着多年经验的阿里巴巴Java高级工程师，请你由浅入深、用通俗易懂的语言给我讲讲这个知识点',
                    '：：出题': '你现在是一个有着多年经验的阿里巴巴Java高级工程师，请你针对这个知识点，出几点可能的面试问题，并给出你认为出色的回答。',
                    '：：案例': '你现在是一个有着多年经验的阿里巴巴Java高级工程师，请你针对这个知识点，举出一个生动形象的实际例子来展示，以便于我理解'
                },
                en: {
                    '：：回答': 'You are now a senior Java engineer with many years of experience at Alibaba. If you encounter the following interview question, how would you answer it? Please demonstrate.',
                    '：：讲解': 'You are now a senior Java engineer with many years of experience at Alibaba. Please explain this concept to me in simple and easy-to-understand language, starting from the basics.',
                    '：：出题': 'You are now a senior Java engineer with many years of experience at Alibaba. Please come up with several interview questions based on this topic and provide what you consider to be excellent answers.'
                }
            },
            writing: {
                zh: {
                    '：：版本': '请提供多个版本供参考。',
                    '：：逻辑': '请帮助分析并优化这个论点的逻辑结构，以使其更具说服力。',
                    '：：一致性': '请阅读并润色整篇论文，确保一致性和连贯性。'
                },
                en: {
                    '：：版本': 'Please provide multiple versions for reference.',
                    '：：逻辑': 'Please help me analyze and optimize the logical structure of this argument to make it more convincing.',
                    '：：一致': 'Please read and polish the entire paper to ensure consistency and coherence.'
                }
            }
        };
        inputElement.addEventListener('keyup', (event) => keyUpEventHandler(inputElement, categorySelector, languageSelector, promptSets, suggestionsContainer));
    }

    function keyUpEventHandler(inputElement, categorySelector, languageSelector, promptSets, suggestionsContainer) {
        suggestionsContainer.className = 'suggestions-container hidden';
        // 清除旧的建议
        suggestionsContainer.innerHTML = '';

        const category = categorySelector.value;
        const language = languageSelector.value;
        const cursorPosition = inputElement.selectionStart;
        const inputValue = inputElement.value.slice(0, cursorPosition);


        // 检查输入是否以`：：`结尾
        if (inputValue.endsWith('：：')) {
            suggestionsContainer.classList.remove('hidden');
            let index = 1;
            for (const key in promptSets[category][language]) {
                const suggestion = document.createElement('div');
                suggestion.textContent = index + '. ' + key.replace('：：', '');
                suggestion.className = 'suggestion';
                suggestion.setAttribute('data-index', index);
                suggestion.addEventListener('click', () => {
                    const beforeKey = inputValue.slice(0, cursorPosition - 2);
                    const afterKey = inputElement.value.slice(cursorPosition);
                    inputElement.value = beforeKey + promptSets[category][language][key] + afterKey;
                    inputElement.selectionStart = cursorPosition - 2 + promptSets[category][language][key].length;
                    inputElement.selectionEnd = cursorPosition - 2 + promptSets[category][language][key].length;
                    suggestionsContainer.innerHTML = ''; // 隐藏建议列表
                });
                suggestionsContainer.appendChild(suggestion);
                index++;
            }
        } else {
            suggestionsContainer.classList.add('hidden');
            // 检查输入是否以 `：：` + 编号 结尾
            let promptInserted = false;
            let index = 1;
            for (const key in promptSets[category][language]) {
                const indexString = '：：' + index;
                if (inputValue.endsWith(indexString)) {
                    const beforeKey = inputValue.slice(0, cursorPosition - indexString.length);
                    const afterKey = inputElement.value.slice(cursorPosition);
                    inputElement.value = beforeKey + promptSets[category][language][key] + afterKey;
                    inputElement.selectionStart = cursorPosition - indexString.length + promptSets[category][language][key].length;
                    inputElement.selectionEnd = cursorPosition - indexString.length + promptSets[category][language][key].length;
                    promptInserted = true;
                    break;
                }
                index++;
            }

            // 如果不是 `：：` + 编号 结尾，正常处理 Prompt 插入
            if (!promptInserted) {
                for (const key in promptSets[category][language]) {
                    if (inputValue.endsWith(key)) {
                        const beforeKey = inputValue.slice(0, cursorPosition - key.length);
                        const afterKey = inputElement.value.slice(cursorPosition);
                        inputElement.value = beforeKey + promptSets[category][language][key] + afterKey;
                        inputElement.selectionStart = cursorPosition - key.length + promptSets[category][language][key].length;
                        inputElement.selectionEnd = cursorPosition - key.length + promptSets[category][language][key].length;
                        break;
                    }
                }
            }
        }
    }


    function setupSelector() {
        const inputElement = document.querySelector('input[type="text"], textarea');
        if (!inputElement) return;

        setupKeyListener(inputElement);
    }

    setupSelector();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                setupSelector();
            }
        });
    });

    const targetNode = document.querySelector('body');
    observer.observe(targetNode, { childList: true, subtree: true });
})();
