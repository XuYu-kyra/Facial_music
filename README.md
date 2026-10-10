# Facial Expression–Driven Music Player

[English](#english) · [中文](#中文)

A Django web application that connects facial-expression recognition with an emotion-indexed music library. Users can capture a webcam frame or upload an image, inspect five expression scores, request matching playlists, and control music playback without leaving the page.

## English

### Product flow

The project explores how a computer-vision result can become part of a complete interactive product rather than remain a standalone model prediction.

```text
webcam capture or image upload
              │
              ▼
      Django recognition endpoint
              │
              ▼
Haar face detection + largest-face crop
              │
              ▼
  48 × 48 grayscale preprocessing
              │
              ▼
adapted TensorFlow/Keras FER checkpoint
              │
              ▼
five expression scores + predicted label
              │
              ▼
emotion-keyed MusicList query
              │
              ▼
playlist rendering + browser audio playback
```

The application uses five output labels: anger, happiness, sadness, surprise, and calm. The product layer maps those labels to playlist categories and returns the selected mood list together with calm alternatives.

### My contribution

My work is the **adaptation and end-to-end product integration** around the facial-expression recogniser:

- structured the project as two Django applications, separating recognition from music-library responsibilities;
- implemented webcam capture and image-upload flows in the browser;
- connected base64 canvas frames and multipart file uploads to the Django recognition endpoint;
- translated recognition output into application-level emotion identifiers and playlist queries;
- designed the `Music` and `MusicList` data models, media paths, category mapping, and Django Admin management;
- built the playlist, recognition, and player pages, including Ajax state updates, playback controls, next-track behaviour, and progress display;
- replaced developer-machine paths with repository-relative paths for checkpoints, Haar cascades, uploaded images, static assets, and media;
- moved the Django secret, debug mode, and allowed hosts to environment-based configuration.

### Recognition integration

The browser obtains a webcam stream through `navigator.mediaDevices.getUserMedia`, draws a snapshot to a canvas, and sends its PNG data through `FormData`. Users can also select an existing image. The Django endpoint normalises both inputs into the same PIL/OpenCV path.

On the server, the recogniser:

1. converts the image to grayscale;
2. detects faces with an OpenCV Haar cascade;
3. selects the largest detected face;
4. resizes it to the model's `48 × 48` input;
5. runs the restored TensorFlow checkpoint;
6. returns five class scores and the selected label as JSON.

The front end renders both the label and per-class percentages, so the model output remains visible before the user requests a playlist.

### Music and playback layer

`Music` stores an uploaded audio file and display name. `MusicList` groups tracks under one of five mood categories through a many-to-many relationship. The player endpoint serves two focused actions:

- return playlist contents for a recognised emotion;
- resolve a selected track to its media URL for playback.

The page assembles the returned tracks into visible lists and uses the browser audio element for play/pause, next-track navigation, title updates, and progress feedback. Because playlist content is managed through Django Admin, music can be changed without rewriting the recognition code.

### Tech stack

| Layer | Technology | Responsibility |
|---|---|---|
| Web back end | Django 2.0.7, SQLite | Routing, models, admin, JSON endpoints, media handling |
| Vision adapter | OpenCV, Pillow, NumPy | Face detection, crop, resize, image conversion |
| Inference | TensorFlow / Keras | Loading and running the existing five-class FER checkpoint |
| Browser capture | MediaDevices, Canvas, FormData | Webcam frames and uploaded-image requests |
| Music domain | Django ORM, many-to-many relations | Tracks, playlists, mood categories, media URLs |
| Front end | HTML, CSS, JavaScript, jQuery/Ajax | Recognition states, playlists, player controls, progress |
| Configuration | Environment variables, repository-relative paths | Portable secrets, hosts, model assets, static files, and media |

### Attribution

The core FER files [`faceemotion/Network.py`](faceemotion/Network.py), [`faceemotion/Utils.py`](faceemotion/Utils.py), and [`faceemotion/formatPredict.py`](faceemotion/formatPredict.py) retain their original header credit to **LZF Zachary / zrawberry.com**. I do not claim authorship of that CNN implementation or checkpoint. In this project, I adapted those components for portable paths and integrated them into the Django request, playlist, and playback workflow described above.

### Run locally

```bash
python -m venv .venv
# macOS/Linux: source .venv/bin/activate
# Windows:     .\.venv\Scripts\Activate.ps1

pip install "Django==2.0.7" tensorflow opencv-python pillow numpy pandas matplotlib
python manage.py migrate
python manage.py runserver
```

The repository includes the FER checkpoint, Haar cascade, sample database content, and media used by the prototype. Useful routes include:

- `/player/` — integrated recognition and music player;
- `/musics-list/` — playlist view;
- `/fermodel/` — recognition page;
- `/fermodel/recognize/` — image-recognition endpoint.

Optional Django settings are documented in [`.env.example`](.env.example). By default, the local server can use the development values and repository-relative model/media paths.

### Project scope

This is an interaction prototype: its engineering value is the complete path from browser camera input to computer-vision inference, domain mapping, database-backed playlist selection, and media playback. Expression predictions are used as an interface signal for exploring music; they are not presented as a psychological assessment.

---

## 中文

这是一个把人脸表情识别接入网页音乐播放器的 Django 应用。用户可以拍摄摄像头画面或上传图片，查看五类表情的预测分数，再根据识别结果获取对应歌单并直接在页面中播放。

项目的重点不是单独展示一次模型预测，而是把计算机视觉结果继续连接到数据模型、推荐逻辑和完整的浏览器交互中。

### 产品链路

```text
摄像头拍摄或上传图片
          │
          ▼
    Django 识别接口
          │
          ▼
Haar 人脸检测 + 最大人脸裁剪
          │
          ▼
  48 × 48 灰度预处理
          │
          ▼
适配后的 TensorFlow/Keras FER checkpoint
          │
          ▼
五类分数 + 最终表情标签
          │
          ▼
按情绪查询 MusicList
          │
          ▼
渲染歌单 + 浏览器播放音乐
```

应用使用愤怒、快乐、悲伤、惊讶和平静五类输出。产品层将模型标签转换成歌单类别，返回当前情绪对应的歌单，同时提供平静类的备选列表。

### 我的工作

我在这个仓库中的主要贡献是对已有表情识别组件进行 **适配与端到端产品集成**：

- 将项目拆分为 `faceemotion` 与 `musicplayer` 两个 Django application，分离识别和音乐业务职责；
- 在浏览器中实现摄像头画面获取、canvas 截图和本地图片选择；
- 将 base64 截图与 multipart 文件上传统一接入 Django 识别接口；
- 把模型预测结果转换为应用层情绪编号，并连接到歌单查询；
- 设计 `Music`、`MusicList` 数据模型、媒体路径、情绪分类和 Django Admin 管理；
- 完成歌单、识别和播放器页面，包括 Ajax 状态更新、播放/暂停、下一首、标题与进度显示；
- 将 checkpoint、Haar cascade、上传图片、静态文件和媒体路径改为基于仓库位置解析，消除开发机绝对路径依赖；
- 将 Django secret、debug 和 allowed hosts 改为环境配置。

### 识别模块如何接入应用

前端通过 `navigator.mediaDevices.getUserMedia` 获取摄像头视频，把当前画面绘制到 canvas 后，以 PNG 数据放入 `FormData` 发送；用户也可以直接选择已有图片。Django 接口将这两种输入统一转换为 PIL/OpenCV 可处理的图像。

服务端依次执行：

1. 将图像转为灰度；
2. 使用 OpenCV Haar cascade 检测人脸；
3. 选择面积最大的人脸区域；
4. 缩放为模型需要的 `48 × 48` 输入；
5. 加载并运行 TensorFlow checkpoint；
6. 以 JSON 返回五类分数和预测标签。

页面会先展示识别标签及每一类的百分比，再由用户决定是否获取歌单，因此模型输出并没有被隐藏在推荐结果后面。

### 音乐与播放模块

`Music` 保存歌曲名称和音频文件，`MusicList` 通过 many-to-many relation 组织歌曲，并为歌单标记五种情绪类别。播放器接口承担两个明确动作：

- 根据识别出的情绪返回歌单内容；
- 根据歌曲 ID 返回名称和媒体 URL，供浏览器播放。

前端把返回结果渲染为可见歌单，并使用浏览器 audio element 实现播放/暂停、下一首、标题更新和进度反馈。歌单内容通过 Django Admin 管理，因此更换音乐或调整分类时不需要修改识别代码。

### 技术栈

| 层级 | 技术 | 在项目中的作用 |
|---|---|---|
| Web 后端 | Django 2.0.7、SQLite | 路由、数据模型、管理后台、JSON 接口、媒体管理 |
| 视觉适配 | OpenCV、Pillow、NumPy | 人脸检测、裁剪、缩放与图像转换 |
| 模型推理 | TensorFlow / Keras | 加载并运行已有的五分类 FER checkpoint |
| 浏览器采集 | MediaDevices、Canvas、FormData | 摄像头截图与图片上传 |
| 音乐业务 | Django ORM、many-to-many relation | 歌曲、歌单、情绪分类与媒体 URL |
| 前端交互 | HTML、CSS、JavaScript、jQuery/Ajax | 识别状态、歌单、播放器控制和进度显示 |
| 配置 | 环境变量、仓库相对路径 | 管理 secret、host、模型资源、静态文件与媒体 |

### 署名说明

核心 FER 文件 [`faceemotion/Network.py`](faceemotion/Network.py)、[`faceemotion/Utils.py`](faceemotion/Utils.py) 和 [`faceemotion/formatPredict.py`](faceemotion/formatPredict.py) 的原始文件头标注作者为 **LZF Zachary / zrawberry.com**。因此，我不将其中的 CNN 实现或 checkpoint 声称为自己原创。我的工作是在这些组件基础上完成路径与运行方式适配，并将其接入上述 Django 请求、歌单选择和播放器流程。

### 本地运行

```bash
python -m venv .venv
# macOS/Linux: source .venv/bin/activate
# Windows:     .\.venv\Scripts\Activate.ps1

pip install "Django==2.0.7" tensorflow opencv-python pillow numpy pandas matplotlib
python manage.py migrate
python manage.py runserver
```

仓库包含原型使用的 FER checkpoint、Haar cascade、示例数据库内容和媒体文件。常用路由包括：

- `/player/`：表情识别与音乐播放的一体化页面；
- `/musics-list/`：歌单页面；
- `/fermodel/`：识别页面；
- `/fermodel/recognize/`：图片识别接口。

可选 Django 设置记录在 [`.env.example`](.env.example) 中。本地默认可以使用开发配置和仓库相对的模型/媒体路径。

### 项目定位

这是一个交互式原型，工程价值在于完整串联浏览器摄像头输入、计算机视觉推理、业务标签映射、数据库歌单选择和媒体播放。表情结果在这里是一种探索音乐交互的界面信号，不用于心理状态判断。

