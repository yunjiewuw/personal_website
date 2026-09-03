---
title: Next Idea Prediction：預測一個 idea 代表什麼？需要什麼？
date: 2026-09-03
type: opinion
summary: 從人機協同演化的老理想出發，提出一個「預測下一個念頭」的認知世界模型提案，並誠實面對它比 LLM 的 next word prediction 難在哪裡。
color: fog
image: /next-idea-prediction-cover.jpg
imageCredit: 'Photo by <a href="https://unsplash.com/@m_malkovich?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">petr sidorov</a> on <a href="https://unsplash.com/photos/king-of-diamonds-playing-card-GESOWH4YLRI?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>'
tags: [opinion, science_tech, next_idea_prediction, VF_project]
---

## 「人機協作，產生綜效飛輪」是個跨越世代的理想 Utopia

在 AI 浪潮下，有些稱為智慧革命，AI 正在重新設計我們的能力、需求與習慣。透過當代科技做為人類心智的加強錠，不只是在 AI 所帶來的智慧革命之後才開始為人所重視，其實早在 1962 美國著名發明家與人機互動先驅 Douglas Engelbart 就提出了一個人機共同演化，互相助力並產生綜效 (synergy) 的理論框架：[Augmenting Human Intellect: A Conceptual Framework](https://www.dougengelbart.org/content/view/138)。透過與 AI 的協同互動（Synergistic），人類現有的智力在生產、創作、決策上，得以發生更大的效用[^1]。

[^1]: 使用效用一詞是因為在本論述中科技的目的並非提升人類的智商（Native Intelligence），而是其所衍生的價值。

## What if we build a model, for Next Idea Prediction?

![](/next-idea-prediction-hanged-man.jpg)
<p class="credit">Photo by <a href="https://unsplash.com/@ksyfffka07?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ksenia Yakovleva</a> on <a href="https://unsplash.com/photos/a-hand-holds-the-hanged-man-tarot-card-Mr0ACK137Gg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></p>

> what will happen if we build such model?
> I don't know, but it's gonna be ✨ SO COOL!!! ✨

Next Idea Prediction 聽著很酷。酷歸酷，冷靜之後還是得思考，**如何實作？這個模型怎麼做？**

### 世界認知模型

我們從小到大的記憶，幫助我們建立起了一個對於世界運作與規範的模型，它不全然的反應真實物理世界的樣貌，而是**經過人類 (個人) 感官詮釋後的世界認知模型**。

這個**世界認知模型**具備隱性（tacit, implicit）的特質：它主導我們的行為、決策[^2]，但我們未必能完整報告，目前也沒有對於這個「**世界認知模型**」具系統性的直接測量方式。實務上只能透過近似的方式窺探、試圖拼湊出這個**世界認知模型的樣貌**，常見的兩條路徑是：

- **生理/神經活動解碼**——從生理/神經訊號解碼生理狀態；
- **主觀語義解碼**——從語言產出（自述、日誌、對話紀錄）反推內在概念與思考結構。

[^2]: 透過反覆的感官和動作經驗學習階層化的預測任務，將物理世界中的事件，平行地投射到以機率強化各維度間連結的神經迴路中。透過現有的階層，我們的大腦足以表徵物理世界中受注意或感知的各個面向，並透過反覆的經驗提取出階層性的具體至抽象的規律。

在個人的世界認知模型中，以個人為主體，我們可以透過上述的 (1) 生理/神經活動解碼 以及 (2) 主觀語義解碼等途徑，對不同時間尺度下的狀態與結構做階層性、抽象規律的提取 (extraction, decode)。這些狀態或是結構的改變可能指向個人與所處環境 (例如：情境、關係、事件) 互動的變化。

| 時間尺度 | 現象 | 該用什麼 | 相關領域 |
|---|---|---|---|
| 秒 | 注意力失誤、警覺度、負荷、驚訝反應 | EEG / 眼動 / pupillometry | passive BCI |
| 分鐘–小時 | 情緒、努力成本、狀態切換 | HRV、EDA、行為痕跡、稀疏 EMA | digital phenotyping, passive BCI |
| 天–週 | 節律、習慣、恢復 | 純行為與生理痕跡；文字記錄 (journal, chat sessions) 的知識圖譜 | digital phenotyping |
| 月–年 | 慣性、生活模式、想法 | 行為痕跡 + 因果檢定；文字知識圖譜的超圖/元圖 | information / knowledge extraction |
| 期 | 信念、價值判斷 | 超圖/元圖 (?) | sociology, social psychology, clinical psychology? |

建立以 Next-idea prediction 為目標的認知世界模型對於個人最大的意義在於建立**可解釋的環境改變—不同階層狀態**間的對應預測[^3]，可以衍生的下游任務包含：

- 具體到抽象的階層性規律對應 (mapping)：對可描述的想法背後的底層生理/神經規律進行統計描述、解碼，
- 做為認知輔具，應用於 augmented decision：刻畫提取實際行動前的歷史記錄中相關的狀態與行動，或是分析語義情境與當前狀態下最「優」的決策。

這個模型系統必需具有動態性，也就是具備記錄正向與負向回饋的能力 (consolidation)，對於認知世界模型現有框架下可解與尚不可解的問題進行對整體框架的調整或再定義。

![George Box：「All models are wrong, but some are useful.」](/next-idea-prediction-george-box-quote.jpg)

[^3]: 可解釋性並非是 discrete 的項目，無法找到一個明確的切分指標區分可解釋與不可解釋；可解釋性更像是一個連續的特徵，套用一句 "All models are wrong, but some are useful." — George Box (詮釋：最後一句的意思大約是用來逼近規則的模型要是可以解釋的吧)

## Next Idea Prediction

### About "PREDICTION": prediction of next idea

這裡先簡單針對兩個消息 (當然，一個好一個壞) 做個討論，也埋個伏筆。

> 好消息是 next idea prediction seems to be plausible；壞消息是 next idea prediction is plausible to an extent. (currently)

普遍而言，認知神經科學研究中有諸多證據說明，我們可以透過 fMRI MVPA 能提前至多 10 秒預測到高於隨機猜測水準的粗略認知決策「類別」，例如：選左、選右、加法、減法等。又或是在「何時」觸發特定的動作（cite: Predicting free choices for abstract intentions：[https://pmc.ncbi.nlm.nih.gov/articles/PMC3625266/](https://pmc.ncbi.nlm.nih.gov/articles/PMC3625266/)）。也就是說，在認知神經科學上，next idea prediction 已經初具雛形。

然而，壞消息：目前的預測僅停留在對於粗略時間、類別等 classification task 的範疇，對於語義層面的開放式概念或是想法，目前仍停留在實驗室的 POC 階段[^4]，更別提對於 insight 等高階思考的預測或是解碼。

[^4]: 這是我很感興趣的一系列研究，也許之後我會把我的閱讀筆記整理上來。總的來說，非侵入式語意解碼，例如 fMRI, MEG, EEG，能：透過聽故事或是跨模態看影片時大腦的 fMRI 活動，重建出刺激的語義大意 (Tang et al. 2023)；透過打字時的 MEG 或是 EEG 活動解碼欲表達的語義內容（average CER: MEG 32%, EEG 65%) (Meta, Brain2Qwerty)；透過侵入式腦部活動對想像語音動作解碼（Kunz/Meschede-Krasa/Willett et al., Cell 2025）在受限詞集下達最高 74% 準確率。但這些研究多需透過大量的資料先建立 encoding model，與透過 LM 或是主動在設計上對於潛在語義內容做收斂，目前無法做到 few-shot，或是在語義念頭出現前的開放式預測。

但你發現了嗎？回到這個表中，我們可以發現目前技術成熟度最高的量測手段（brain imaging：EEG, fMRI, MEG, etc；眼動）落在「秒」這一列，但對於 idea (甚至是 insight) 等語義念頭的預測，目前仍無法實作。那是為什麼呢？

## 比起 LLM 擅長的 Next Word Prediction，為什麼 Next Idea Prediction 更難？

![](/next-idea-prediction-idea-bulb.jpg)
<p class="credit">Photo by <a href="https://unsplash.com/@loganvoss?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Logan Voss</a> on <a href="https://unsplash.com/photos/a-glowing-light-bulb-on-a-dark-background-t6jjYaHtjPw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></p>

標題中的 "Next Idea Prediction" 是把 idea 當成 token 來看。現行 LLM 透過海量資料的關聯與標註，做出以 word 為 token 的 next word prediction；架構上兩者都是在預測「下一個 token」。

但 next idea prediction 在訓練上面對的是完全不同的瓶頸：**稀疏回饋、高變異、長延遲，也缺少對於 Idea 的操作型定義**。一個 idea 的好壞可能要幾個月後才知道，中間沒有密集的監督訊號。

### About IDEA: what is to be predicted?

在某教科學[^5] 中：

> 「idea」與「concept」在哲學與心理學傳統中從來沒有統一用法：它曾被用來指普遍性（Husserl）、感官意象（Hume）、思想的對象（Descartes）、內容（Burge）、意義（Katz）、信念系統（當代許多心理學家），或泛指一切心智表徵（Brentano）

[^5]: Davis WA. Ideas or Concepts. In: *Meaning, Expression and Thought*. Cambridge Studies in Philosophy. Cambridge University Press; 2002:407-427. [連結](https://www.cambridge.org/core/books/meaning-expression-and-thought/ideas-or-concepts/E597DE4C96DF4C64627681A38EA4D829)

在進入對我對於這些瓶頸的討論與我 propose 的做法之前，我希望先停在一個我私心仍在思考的討論：認知神經科學是實作 Next Idea Prediction 的必要前提嗎？

其實我想答案藏在前面的討論中，而你應該也猜到答案了 ~~(不是，真的會有人看到這裡嗎？)~~

> 是，也不一定是？

![](/next-idea-prediction-puzzle.jpg)
<p class="credit">Photo by <a href="https://unsplash.com/@varpap?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Vardan Papikyan</a> on <a href="https://unsplash.com/photos/a-person-holding-a-piece-of-a-puzzle-in-their-hands-DnXqvmS0eXM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></p>

先前有提到試圖拼湊出這個**世界認知模型的樣貌**，常見的兩條路徑是：

- **生理/神經活動解碼**——從生理/神經訊號解碼生理狀態；
- **主觀語義解碼**——從語言產出（自述、日誌、對話紀錄）反推內在概念與思考結構。

我認為認知神經科學對於第一條路徑（**生理/神經活動解碼**）來說是必要的，而它的效果目前是存在但具有侷限的：先不討論 model accuracy 的話，目前在任務上無法做到 few-shot，或是在語義念頭出現前（又或是即時）進行開放式預測；在預測目標上，無法對較為抽象/跨長時間尺度和概念尺度的語義念頭 (idea, insight) 進行預測，(目前較好的表現發生在限制類別，或是做 classification task 中)。

相反地，在第二條路徑——從語言產出（自述、日誌、對話紀錄）反推內在概念與思考結構，我認為認知神經科學的角色不再那麼的重要，其主要貢獻會是：

- 從「認知與決策」的本質 (ontology, prior) 設計系統：從 Neuroscience principals 建立 ontology ⇒ boundary/rationales of design (design principals)。
- 從認知/認知神經科學理論：提供「IDEA 空間」形式化的可能性。

在第二條路徑中，值得更多探索和研究的方向會是：

- **系統工程／資訊系統**：建立可維護、有彈性的系統設計，透過有效的系統設計，建立個人層次的密集縱向取樣 (HCI involved)
- **資料與資訊科學——有效提取與回饋**：在密集、多模態 (可能不平衡，諸多雜訊的) 縱向取樣中，選出具有代表性的物件 (entity, relation, attribute) 等，並在階層的關係中追蹤改變。

條條大路通羅馬，不論是哪一條途徑，我深深相信 next idea prediction 將助力「人機協作、共榮共長」的願景。世界在時間和空間上都具有那麼大的可能性，who knows!

所以，先賣個關子，這個系列的下一篇，我會分享我目前對於「如何具體打造這個模型」的初步提案，敬請期待。

---

*Murmur —*

好久沒寫作了，突然發現用慣了 AI 我好像不太會寫作了⋯⋯感覺有小天使和小惡魔的狀態不停切換。

> 「不知道是什麼人會讀這篇文章耶！你給我像寫 paper 一樣好好寫！好好組織！」

> 『(拍飛完美主義) 怕啥！網路上的資訊那麼多，到底誰會那麼在意你寫的文章，不怕！就寫！』

對，所以就出現了你現在看到的這篇文章。

哈，總之，謝謝你看到這裡！總是會好奇這世界上會不會也有人有著相似的夢想或想法，如果你有任何有趣的想法，也歡迎和我討論喔 ~
