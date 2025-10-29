一个基于 Django 的人脸表情识别 + 音乐推荐/播放 Web 应用：通过摄像头/图片识别 5 类表情（愤怒、快乐、悲伤、惊讶、平静），并根据识别结果推荐对应歌单，支持在线播放。

## 功能概览
- 表情识别：支持摄像头抓取或图片上传，自动检测人脸并预测表情
- 音乐推荐：根据表情返回对应歌单，支持在线播放与切换
- 后台管理：Django Admin 管理音乐与歌单（`/admin/`）
- 静态资源：内置前端页面、Bootstrap、jQuery 等

## 目录结构（关键部分）
- `FERmusicplayer/`：Django 项目根
  - `faceemotion/`：表情识别模块（模型、检测逻辑、页面）
    - `nnSource/`：预训练模型与级联分类器（haarcascade）
  - `musicplayer/`：音乐模块（数据模型、列表、播放器页）
  - `static/` `templates/`：静态与模板
  - `db.sqlite3`：示例数据库

## 运行环境
- Python 3.7 ~ 3.10（建议 3.8/3.9）
- 操作系统：Windows / macOS / Linux

### 主要依赖
- Django 2.0.7（项目由该版本生成）
- TensorFlow 2.x（使用 tf.keras，建议 2.3 ~ 2.6）
- opencv-python
- Pillow
- numpy
- pandas（用于加载/预处理 fer2013）
- matplotlib（仅训练/可视化需要）

你可以直接安装一个常用组合（按需增减）：

```bash
pip install "Django==2.0.7" tensorflow==2.6.0 opencv-python pillow numpy pandas matplotlib
```

> 注意：TensorFlow 在不同平台的兼容性不同，如果安装失败，请根据本机 Python/操作系统选择合适的 TF 版本。

## 快速开始
1) 克隆并进入项目目录：
```bash
git clone <your-repo-url>
cd FERmusicplayer
```

2) 初始化虚拟环境（可选但强烈推荐）：
```bash
python -m venv .venv
# Windows
. .venv\\Scripts\\activate
# macOS/Linux
# source .venv/bin/activate
```

3) 安装依赖（见上文“主要依赖”）。

4) 数据库迁移（项目已附带 `db.sqlite3`，通常可以跳过；如需重建）：
```bash
python manage.py makemigrations
python manage.py migrate
```

5) 启动开发服务器：
```bash
python manage.py runserver
```

6) 打开浏览器：
- 首页/播放器：`http://127.0.0.1:8000/` 或 `http://127.0.0.1:8000/player/`
- 音乐列表：`http://127.0.0.1:8000/musics-list/`
- 表情识别页：`http://127.0.0.1:8000/fermodel/`
- 识别接口（AJAX）：`/fermodel/recognize/`
- 后台管理：`http://127.0.0.1:8000/admin/`

## 表情识别说明
- 模型结构定义：`faceemotion/Network.py`（`FerModel`/`FerModel2`）
- 识别流程与摄像头/上传处理：`faceemotion/formatPredict.py`、`faceemotion/views.py`
- 预训练权重与人脸检测：`faceemotion/nnSource/` 下的 `checkpoint` 与 `haarcascade_files/`

项目当前包含了一套 checkpoint 文件（如 `fermodel.ckpt1.*`）。识别时会尝试从 `checkpoint` 路径加载权重。

> 重要：若运行时报“请先训练模型并生成checkpoint！”或找不到权重文件，通常是因为路径不一致。见下文“路径与兼容性”一节进行修复。

## 路由与页面
- `''` → `musicplayer.urls`（首页重定向到播放器）
- `/musics-list/` → 音乐列表
- `/player/` → 播放器页面
- `/fermodel/` → 表情识别页面（摄像头/上传）
- `/fermodel/recognize/` → 上传/摄像头的 AJAX 识别接口

## 数据与训练（可选）
- 数据集：`fer2013`（CSV），加载逻辑见 `faceemotion/Utils.py`
- 类别映射：已将原始 7 类映射为 5 类（去掉“恶心/恐惧”）
- 训练入口：`faceemotion/Network.py` 中的 `train_network`

如果你仅需演示/推理，可直接使用已有 checkpoint；如需重新训练，请准备 `fer2013.csv` 到 `faceemotion/Source/fer2013/` 路径（或按需调整 `Utils.py` 中的路径）。


## 常见问题
- 识别接口返回空数据：
  - 检查是否检测到人脸（无脸图像会返回 `pred = -1`）
  - 检查 OpenCV 是否正确加载 Haar 模型
- 模型加载失败：
  - 确认 checkpoint 路径与文件名一致（见“路径与兼容性”）
  - TensorFlow 版本不兼容，尝试降级/升级 TF
- 静态资源 404：
  - 确认 `STATICFILES_DIRS` 配置，开发环境无需 `collectstatic`
- 中文显示问题：
  - 模板/控制台建议使用 UTF-8 编码

## 授权与致谢
- 仅供学习与研究使用，模型/数据版权归原作者所有
- 代码中的模型定义、工具等来源于作者注释（`Author: LZF Zachary` / `zrawberry.com`），在此致谢

## 开发与贡献
欢迎提交 Issue 和 PR 来改进代码、修复路径、完善部署与依赖版本说明。
