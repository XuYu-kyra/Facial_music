# Facial Expression Music Recommendation System

[English](#english) · [中文](#中文)

## English

This Django application turns a webcam frame or uploaded image into a lightweight emotion-aware music experience. It detects a face, classifies one of five emotion categories, and uses the result to select a playlist that can be played and managed in the browser.

### The story

The project started from a simple interaction question: can a user’s current visual state become a useful, immediate recommendation? I connected a complete path from computer vision to a web product instead of stopping at an offline classifier: capture → face crop → 48×48 grayscale preprocessing → neural inference → emotion-to-playlist lookup → playback.

### What I built

- A TensorFlow/Keras convolutional model with checkpoint-based training and inference for five classes: anger, happiness, sadness, surprise, and calm.
- OpenCV Haar-cascade face detection, largest-face selection, grayscale normalisation, and fixed-size model input preparation.
- Django views and AJAX endpoints that connect recognition results to `MusicList` and `Music` records.
- Browser pages for the player, music lists, emotion detection, and Django Admin content management.
- A train/evaluate path in `faceemotion/Network.py`, plus persisted checkpoints and the preprocessing logic in `faceemotion/formatPredict.py`.

### Quick start

```bash
python -m venv .venv
# macOS/Linux: source .venv/bin/activate
# Windows:    .\.venv\Scripts\Activate.ps1
pip install "Django==2.0.7" tensorflow opencv-python pillow numpy pandas matplotlib
python manage.py migrate
python manage.py runserver
```

Useful routes include `/player/`, `/musics-list/`, `/fermodel/`, and `/fermodel/recognize/`. Checkpoint and cascade paths are currently development-oriented; update them before moving the app to another machine.

### Limitations

The model is a small educational prototype, not a validated affect-recognition system. Dataset bias, lighting, pose, and the five-class mapping all affect predictions. A production version would add a model card, calibrated confidence, consent and retention controls, portable paths, and offline evaluation before using predictions for anything consequential.

## 中文

这是一个 Django 情绪感知音乐推荐应用：用户可以通过摄像头或上传图片进行人脸检测，模型把结果分类为五种情绪，再从数据库中的歌单里选择匹配内容并在网页播放器中播放。

### 项目故事

我想验证一个很直观的交互链路：用户当下的视觉状态能不能转化为即时、可用的音乐推荐。项目没有停留在离线分类器，而是把 **采集 → 人脸裁剪 → 48×48 灰度预处理 → 神经网络推理 → 情绪歌单匹配 → 播放** 串成了一个可以操作的 Web 产品。

### 我的工作

- 使用 TensorFlow/Keras 实现带 checkpoint 的卷积网络训练与推理，输出愤怒、快乐、悲伤、惊讶、平静五类；
- 使用 OpenCV Haar cascade 检测人脸、选择最大人脸、灰度归一化并整理模型输入；
- 编写 Django 视图和 AJAX 接口，把识别结果映射到 `MusicList` 与 `Music` 数据；
- 完成播放器、歌单、情绪检测页面和 Django Admin 管理流程；
- 将训练入口、checkpoint 加载和预处理逻辑分别组织在 `faceemotion/Network.py` 与 `faceemotion/formatPredict.py`。

### 快速运行

```bash
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install "Django==2.0.7" tensorflow opencv-python pillow numpy pandas matplotlib
python manage.py migrate
python manage.py runserver
```

可访问 `/player/`、`/musics-list/`、`/fermodel/` 和 `/fermodel/recognize/`。checkpoint 与 Haar 文件路径目前仍偏向开发机配置，迁移到新环境时需要调整。

### 诚实边界

这是教育/研究原型，不是经过验证的情绪识别系统；数据集偏差、光照、姿态和五分类映射都会影响结果。若继续产品化，应补充 model card、置信度校准、用户同意与数据留存策略、可移植路径和离线评测。
