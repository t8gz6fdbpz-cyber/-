---
name: 鸣鸣很忙案例页
description: 仅适用于鸣鸣很忙详情路由的黑金视觉与参考运动结构
colors:
  mm-black: "#050505"
  mm-raised: "#0b0a08"
  mm-gold: "#f2c15b"
  mm-gold-deep: "#c9973e"
  mm-champagne: "#c8ae78"
  mm-text: "#e8dfcc"
  mm-muted: "#8f846f"
  mm-rule: "rgba(200,174,120,.2)"
typography:
  display:
    fontFamily: '"Songti SC",SimSun,serif'
    fontSize: "clamp(68px,8.6vw,132px)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-.04em"
  headline:
    fontFamily: '"Songti SC",SimSun,serif'
    fontSize: "clamp(60px,7.6vw,116px)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-.025em"
  title:
    fontFamily: '"Songti SC",SimSun,serif'
    fontSize: "clamp(34px,4vw,60px)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-.025em"
  body:
    fontFamily: '"Kanit","PingFang SC","Microsoft YaHei",sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: '"Kanit","PingFang SC","Microsoft YaHei",sans-serif'
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: ".1em"
  orbit-statement:
    fontFamily: '"Kanit","PingFang SC","Microsoft YaHei",sans-serif'
    fontSize: "clamp(24px,3.5vw,64px)"
    fontWeight: 600
    lineHeight: 1.3
  film-title:
    fontFamily: '"Songti SC",SimSun,serif'
    fontSize: "clamp(44px,5.2vw,82px)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-.025em"
  film-fact:
    fontFamily: '"Kanit","PingFang SC","Microsoft YaHei",sans-serif'
    fontSize: "clamp(32px,3.3vw,48px)"
    fontWeight: 400
    lineHeight: 1.15
spacing:
  mm-gutter: "clamp(24px,5.2vw,88px)"
  mm-gutter-mobile: "22px"
  heading-grid-gap: "28px"
  subheading-margin: "36px"
  divider-padding: "24px"
components:
  back-link:
    textColor: "{colors.mm-text}"
  back-link-hover:
    textColor: "{colors.mm-gold}"
  section-intro:
    textColor: "{colors.mm-gold}"
    typography: "{typography.headline}"
  film-fact:
    textColor: "{colors.mm-gold}"
    typography: "{typography.film-fact}"
  video-frame:
    backgroundColor: "{colors.mm-raised}"
  method-row:
    padding: "30px 0"
  evidence-heading:
    textColor: "{colors.mm-gold}"
  orbit-statement:
    textColor: "{colors.mm-text}"
    typography: "{typography.orbit-statement}"
  closing-nav:
    textColor: "{colors.mm-text}"
---

# Design System: 鸣鸣很忙案例页

## Overview

**Creative North Star: "鸣鸣很忙案例页：参考行为复刻"**

这是已经在 `direction.md` 确认的方向名称；本文件不另命名新世界。用户指定黑金配色，以真实项目作品和增长证据为主体，保留参考运动的结构、时间关系与空间层次。大尺度宋体标题、不对称岗位栏和长段黑色留白共同组织阅读，香槟金用于结构，亮金用于标题与关键结果。

本文件只约束 `MingmingCasePage` 及其 `AccountOrbit` 和 `mingming-hierarchy.css` 路由范围，不替代项目根 `DESIGN.md` 或其他页面的视觉身份。来自 `PRODUCT.md` 的持久约束是温暖、精确、有把握的表达，以及运动有序、键盘可达、降低动态和手机可读。具体内容顺序、账号数量及参考时间轴属于此详情页实例，不是全站通用规则。

**Key Characteristics:**

- 黑色连续画布，亮金标题，香槟金结构线与编号。
- 宋体标题搭配无衬线正文，真实媒体保留自身色彩。
- 大留白、不对称排布、原生影片控件与开放式证据序列。
- 滚动驱动的八张空间回环，随后自然展示四张账号证据。
- 降低动态时完整保留十二张账号证据和可读正文。

提取来源为三个实现文件、路由 `direction.md` 与 `PRODUCT.md`；组件示例文案另核对 `src/data/mingmingCase.ts`。前置实现与独立 reviewer 的 ship 结论由主流程提供，本次只记录完成的实现，没有新做视觉审查。格式按 [DESIGN.md canonical spec](https://raw.githubusercontent.com/google-labs-code/design.md/main/docs/spec.md) 的章节顺序组织；前文 token 保留实现中的 CSS 字符串，不为了展示面板改写其单位或色彩格式。

## Colors

色彩值以 frontmatter 为准，对应路由容器上同名的 `--mm-*` CSS 变量；这是单一金色家族加暖黑中性色，没有另造第二或第三强调色。

### Primary

- **亮金 / mm-gold**：首屏、章节及影片标题、关键结果、链接 hover、键盘焦点与文本选择背景。
- **深金 / mm-gold-deep**：岗位栏和阶段列表的结构线，制作步骤编号。
- **香槟金 / mm-champagne**：章节索引、辅助编号、进度填充和圆形章节过渡。

### Neutral

- **近黑 / mm-black**：详情页、首屏、各章节与固定回环舞台的连续底色。
- **暖黑 / mm-raised**：视频及证据图像容器底色；只提供轻微色阶区别。
- **暖白 / mm-text**：正文、链接、回环中央句子及图注主信息。
- **暖灰 / mm-muted**：摘要、职责细节、时间和次级图注。
- **金色透明分隔 / mm-rule**：摘要、图注、章节细线。进度轨道另使用源代码的香槟金低透明度值，详见 sidecar。

**The Route Scope Rule.** 黑金变量只在鸣鸣很忙详情路由生效；离开路由时移除根元素的背景覆盖类，不向其他页面传播视觉身份。

sidecar 的八阶 tonalRamp 是面板色条展示数据。项目没有八阶色板，这些合成 OKLCH 色阶不是新增实现 token，也不得回写应用 CSS。

## Typography

**Display Font:** Songti SC，回退 SimSun、serif。
**Body Font:** Kanit，回退 PingFang SC、Microsoft YaHei、sans-serif。
**Label Font:** 与正文相同；没有独立等宽字体，数字由路由的 tabular-nums 对齐。

标题依靠尺度、字形与黑色留白建立张力；无衬线文字承载业务事实与证据说明。这里没有统一等比字号比例：实现使用多个按视口变化的 clamp，各角色应保留自己的范围。

### Hierarchy

- **Display**：frontmatter 的 display 用于首屏第一行；第二行宋体副题相对字号为 0.7em。
- **Headline**：章节标题使用 headline；h2 本身继承标题字距和 balanced wrapping。
- **Title**：制作、运营、培训子标题使用 title；影片标题使用 film-title，不强行合并两种尺度。
- **Body**：基础正文为 body；章节说明、项目 lead 和方法 lead 在各自容器提升到 18px。文本宽度按用途约 30–72ch，影片摘要桌面 30ch、1100px 以下 56ch。
- **Label**：章节编号和栏目索引使用 label；链接 13px，图注 13px，不强制所有中文索引大写。
- **Orbit statement**：使用独立无衬线 600 权重，三行共十四个淡入单元；手机改为 24px、行高 1.5。

手机（max-width 700px）首屏字号为 clamp(46px,12vw,70px)，章节标题为 clamp(44px,11vw,74px)，影片标题为 clamp(38px,10vw,58px)。证据小标题及总结分别降为 40px 和 44px。这些是当前页面的响应式覆盖，不是替换桌面 frontmatter 值的新全站尺度。

## Layout

主容器宽度为 `min(100% - 2 * var(--mm-gutter),1440px)` 并居中。桌面 gutter 使用 frontmatter 的响应式值，手机换为 mobile 值。不是 8px 基础网格；已提取的 spacing 只是重复出现的布局角色。章节上下留白 clamp(140px,17vw,240px)，影片序列间隔 clamp(150px,17vw,260px)，叙事留白随视口放大。

首屏主体为 `minmax(0,1.25fr) minmax(270px,.65fr)` 两栏，不把岗位信息压成卡片。章节索引与标题分别使用 `minmax(140px,.27fr) 1fr`；子标题索引轨道为 170px 加 28px gap，部分正文随之缩进 198px。影片内容左右交替，两栏为 .43fr 与 .85fr；实际帧固定 16:9。

在 max-width 1100px，影片改为单列，相关正文缩进归零，成果与总结按可用宽度换行。在 max-width 700px，首屏、章节引导、方法与证据标题为块流；正文证据和账号后续序列均单列，培训、运营和总结竖向排列。内容结果桌面交替 52%/42% 宽，培训照片交替 82%/66% 宽；手机全部 100%。

此路由内容顺序是公司岗位、AIGC、全民 IP、内容结果、运营证据、培训、总结。十二张账号证据中前八张进入回环，余四张在回环后自然展示。数量和顺序仅描述已授权实例，不推广为其他案例页模板。

### Scroll structure

桌面回环外层 600svh、sticky 舞台 100svh，对应固定阶段 500svh；手机外层 450svh，对应 350svh。回环局部 progress 使用 start/start 到 end/end。其他章节文字 reveal、首屏退场和章节过渡各自用自己的滚动区间，不能以整页百分比代替局部百分比。

桌面右侧进度线为 top 10vh、right 32px、宽 2px、高 80vh、段隙 6px。五段长度由目标章节真实高度及 ResizeObserver 分配；分段映射 AIGC、全民 IP、内容表现、运营与培训、经历总结。标签跟随当前填充增长点，进度线不接收 pointer，不提供导航；手机隐藏。

## Elevation & Depth

此路由没有 box-shadow 或 text-shadow 词汇。正文层次来自暖黑底色、金色细线、留白和尺度；回环层次来自 perspective、translate3d、rotateY 和纹理曲面。不要用额外阴影模拟账号之间的深度。

回环透视为 1200px。账号图宽 `max(120px, width * .14)`，高为宽度 / 1.5。X 半径为 `width * .34`（34% 视口宽，不是 0.34vw）；桌面 Y 半径为 `height * .2`（20% 视口高，不是 0.2vh），手机 Y 为 80px；Z 桌面 500px、手机 180px。这是对 direction 简写歧义的代码校正。

曲面使用十片本地纹理，单片角度 `((slice + .5) / 10 - .5) * .40724349` 弧度，曲率半径 `imageWidth * 2.454365`，片宽 `imageWidth / 10 + 1.5`。隐藏透明的真实 img 保留 alt 与图片语义，十片纹理装饰层 aria-hidden；不创建重复账号序列。裁切位置由账号 ID 的映射决定，不能用统一 objectPosition 改掉证据主体。

**The Ordered Motion Rule.** 八张账号每张只经历左入、完整一周、右出；位置和可见度由局部 scroll progress 决定，禁止自动计时循环、滚轮拦截和随机轨道。

## Shapes

文字和开放证据容器没有组件圆角 token，媒体保持矩形与自身宽高比；不将浏览器视频控件的形状归入自定义组件规范。细线常为 1px。

唯一大型圆形用于章节过渡：直径 300vmax，中心位于视口底部；固定裁切层初始 top -10svh、高 110svh，下缘圆角 `0 0 50px 50px`。圆形是页面转场实例，不是全站卡片圆角或通用品牌图标。

## Components

下列是现有实现的记录；此路由没有输入框、chips、独立按钮或通用卡片库，不能为凑齐设计系统而新增它们。sidecar 的八个静态片段对应实际返回链接、章节引导、影片事实、影片框、方法步骤、证据标题、回环句子与结尾导航。

### Navigation

返回链接与结尾导航使用暖白文字、inline-flex 图标和正文栈；hover 切换亮金。可交互元素的 focus-visible 为金色 2px outline，offset 5px；链接最小高度 44px。代码只定义 hover 与 focus-visible，没有自定义 active 或 disabled 视觉状态。min-height 不属于 frontmatter 的八种组件属性，准确值保留在 sidecar。

### Section intro and film facts

章节引导把香槟索引与大宋体标题分开；说明在标题下，正文宽度有限。影片 facts 是开放 dl 结构，上方金色透明细线、数字亮金和次级暖灰说明，不带卡片底色。

### Video result

视频配合标题和摘要，桌面交替排布，窄屏自然顺序。使用原生 `controls playsInline preload="metadata"`，保持 16:9 和 object-fit contain，不创建自动播放或自定义播放器。sidecar 仅呈现原生框体，未捆绑媒体资产；实际播放与 poster 由数据文件提供，不从静态预览推断视频可用性。

### Method rows and evidence

制作方法为编号、步骤标题、摘要和上下细线，桌面宽列、手机自然换行。证据图像保留实际纵横比并配文字说明；图像展示不添加 hover 动画、点击查看器或折叠。摘要、图注和章节划分让作品始终可以阅读。

### Loading, reveal and hero

加载遮罩运行 1.6s，首字 .65s 从 110% Y 进入；后续字组以 .55s 展宽至 2.1em，错开 .28s 和 .42s。字母与首屏使用 `cubic-bezier(.22,1,.36,1)`，组展开为 `cubic-bezier(.76,0,.24,1)`。加载遮罩 pointer-events none，不阻断页面操作。

首屏两行用 hero progress 的 [0,.25,.5,.75,1] 分别映射 [0,-10,-33,-70,-125]vw 与相反正值；Y 为 progress × window.innerHeight 补偿纵向滚动，可见度在 [0,.3,.9] 对应 [1,1,0]。标题首次进入是 .72s、延迟 1.15s 和 1.3s 的 CSS 遮罩上升；索引、岗位与底部有各自淡入延时，不合并成通用全站动画。

RevealText 对 start 0.94 到 start 0.65 的局部 progress 映射 Y [104%,0%]，opacity [0,.7,1] → [.25,1,1]。文字遮罩 overflow hidden，降低动态时不附 motion styles。

### Chapter transition

使用 start/start 到 end/start 的 progress；scale 在 [0, desktop 1.1488/1.9 或 mobile 1.14851/1.9,1] 映射 [0,1,1]。固定裁切层的 Y 是 `-max(0,p*1.9-c)*m` svh，桌面 c=1.18889、m=159.0556，手机 c=1.14851、m=156.6693。这些精确数值来自此过渡的参考校准，不是复用动效预设。

### Account orbit

账号 lane i 起点为 i × .05521648；左入 .07361087、转一圈 .46626288、右出 .07361963，单位均为局部 progress。左入从 -0.85 × viewportWidth 到中心，右出到 +0.85 × viewportWidth；转圈用 sin/cos 对应上述 X/Y/Z 半径，rotateY 0→360°。淡入淡出各占进入/退出区间的一半。

中央固定句子为“从定位、内容、投流到培训，建立一套可复制的 IP 孵化系统。”三行十四单元，单元 i 在 [.255+i*.01,.285+i*.01] 淡入。整体 opacity 在 [.27,.30,.625,.75] 对应 [0,1,1,0]；Y 在 [.285,.5,.715] 对应 [86,0,-86]px。只出现这句话，不额外加入装饰标语。

### Reduced motion

React 的 useReducedMotion 分支取消首屏 scroll transform、RevealText 动态样式与圆形 motion 节点；AccountOrbit 完整改为十二张静态账号图和可读句子，不渲染 sticky 舞台及八轨动画。CSS media 查询取消本路由动画和 transition，隐藏加载与圆形容器，移除首屏 clip/opacity/transform 的初始遮罩状态。

进度分段的填充与当前标签仍跟随滚动；它没有在 React 中完全静态化，不能声称“降低动态时所有滚动关联变化消失”。手机本就隐藏进度线。已有验证范围是实际 reduced-motion 组件分支的十二张唯一主页及无固定舞台，加 CSS media 规则检查；浏览器 media emulation 未暴露，所以未声称拍摄了真实系统降低动态模式的浏览器截图。

sidecar 是无需 React 的静态组件预览，所有 class 带 ds- 前缀。因变量实际定义在 .mingming-case 而非 :root，每个片段带同值的局部 ds-world token 容器再以 var(--mm-*) 引用，避免把路由色板注入根作用域。预览不复现需要 scroll progress 的时间轴。

## Do's and Don'ts

### Do:

- **Do** 将黑金 token 和背景覆盖限制在鸣鸣很忙详情路由。
- **Do** 保留原生 16:9 影片控件、真实证据比例及有意义的 alt。
- **Do** 保留八张完整回环与四张后续自然展示，并在降低动态时展示十二张唯一账号。
- **Do** 以对应元素的局部 progress 校准运动，并区分整页与回环百分比。
- **Do** 保留金色键盘焦点、44px 链接触达尺度和手机单列阅读。
- **Do** 将参考校准值、账号裁切与具体证据数量视为本页实例参数。

### Don't:

- **Don't** 覆盖根 DESIGN.md 或将这个路由的黑金身份替换到其他页面。
- **Don't** 引入卡片墙、轮播、折叠、可点击章节轨道、自动循环或滚轮拦截。
- **Don't** 添加参考流体背景或借用参考图片、文案、字体文件和源代码。
- **Don't** 把 X 半径写成 0.34vw，或把桌面 Y 半径写成 0.2vh。
- **Don't** 为不存在的输入框、chips 或按钮系统生成应用 token。
- **Don't** 将预览用 tonalRamp 当作实现色板，或把静态 sidecar 片段当作完整运动组件。
