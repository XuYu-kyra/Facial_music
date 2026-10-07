# Facial Expression–Driven Music Player

[English](#english) · [中文](#中文)

**Tech stack:** Python · Django · TensorFlow/Keras · OpenCV · Pillow · SQLite · HTML/CSS/JavaScript · AJAX

## English

This Django prototype connects a facial-expression recogniser to a browser music player. A webcam frame or uploaded image is preprocessed, classified into one of five labels, and used to select playlists stored in the application database.

### Ownership and provenance

The facial-expression model is **not presented as my original CNN implementation**. The headers in `faceemotion/Network.py`, `faceemotion/Utils.py`, and `faceemotion/formatPredict.py` credit **LZF Zachary / zrawberry.com**. I adapted and integrated those FER components into the Django product flow.

My work represented in this repository is the application layer around the recogniser: image upload/webcam handling, Django endpoints, emotion-to-playlist mapping, music and playlist data models, administration, browser pages, and the end-to-end interaction between recognition and playback.

### Application flow

```text
webcam frame or uploaded image
  -> Haar-cascade face detection
  -> largest-face crop -> 48x48 grayscale input
  -> inherited TensorFlow/Keras FER checkpoint
  -> one of five labels
  -> Django playlist lookup -> browser playback
```

The five labels used by the application are anger, happiness, sadness, surprise, and calm.

### Integration work

- Connected webcam/base64 uploads and file uploads to a Django JSON endpoint.
- Mapped recognition scores to application-level emotion identifiers.
- Implemented `Music` and `MusicList` data flows, playlist selection, and media URLs.
- Built player, playlist, and recognition pages plus Django Admin management.
- Replaced developer-machine absolute paths with paths resolved from the repository, including cascades, checkpoints, and generated images.
- Moved Django secret/debug/host settings to environment variables for portable local setup.

### Run locally

```bash
python -m venv .venv
# macOS/Linux: source .venv/bin/activate
# Windows:    .\.venv\Scripts\Activate.ps1
pip install "Django==2.0.7" tensorflow opencv-python pillow numpy pandas matplotlib
python manage.py migrate
python manage.py runserver
```

Useful routes include `/player/`, `/musics-list/`, `/fermodel/`, and `/fermodel/recognize/`. The repository includes a FER checkpoint under `faceemotion/nnSource/` and sample database/media content.

### Limits and attribution risk

This is an educational prototype, not a validated affect-recognition system. Dataset bias, lighting, pose, privacy, and the five-class mapping all affect predictions. No model card or held-out performance report is included.

The original FER file headers identify an author and website, but the repository does not preserve a precise upstream source URL or licence for those files/checkpoint. That provenance should be confirmed before redistribution or commercial reuse. Until then, the defensible portfolio claim is adaptation and product integration—not authorship of the core FER model.

## 中文

这是一个把人脸表情识别接入网页音乐播放器的 Django 原型。用户通过摄像头或上传图片提供输入，系统完成人脸检测和五分类预测，再从数据库中选择对应歌单并在浏览器播放。

### 署名与工作边界

`faceemotion/Network.py`、`faceemotion/Utils.py` 和 `faceemotion/formatPredict.py` 的文件头明确标注 **Author: LZF Zachary / zrawberry.com**，因此这个仓库不再把 CNN 核心实现描述成我的原创工作。我是在已有 FER 实现基础上做适配，并把它集成到 Django 产品流程中。

我在仓库中的工作重点是应用层：摄像头/图片上传、Django 接口、情绪到歌单的映射、音乐与歌单数据模型、管理后台、页面，以及从识别结果到播放的完整交互。

### 产品链路

输入图片经过 Haar cascade 人脸检测、最大人脸裁剪和 48×48 灰度预处理，再交给已有 TensorFlow/Keras checkpoint；应用使用愤怒、快乐、悲伤、惊讶、平静五类结果查询歌单。

### 集成内容

- 把摄像头 base64 输入和文件上传接入 Django JSON 接口；
- 将识别分数映射为应用层情绪编号；
- 实现 `Music`、`MusicList` 数据流程、歌单选择和媒体 URL；
- 完成播放器、歌单、识别页面和 Django Admin；
- 将 cascade、checkpoint 和生成图片路径改为基于仓库位置解析，移除开发机绝对路径；
- 将 Django secret、debug 和 host 配置改为环境变量。

### 运行与边界

按上面的命令安装依赖、迁移数据库并启动服务；常用路由包括 `/player/`、`/musics-list/`、`/fermodel/` 和 `/fermodel/recognize/`。

这是教学原型，不是经过验证的情绪识别系统；数据偏差、光照、姿态、隐私和五分类设计都会影响结果，仓库也没有 model card 或留出集性能报告。

当前文件头只提供作者和网站，没有保留精确的上游仓库地址或对应许可证，checkpoint 来源也需要进一步确认。因此用于求职时应准确表述为“适配并集成已有 FER 实现”，不能声称独立编写核心 CNN。
