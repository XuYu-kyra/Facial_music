# Facial Expression Music Recommendation System

This project is a Django-based web application that combines facial expression recognition with music recommendation and playback. It recognizes five facial expression categories from a webcam capture or uploaded image and recommends a matching playlist for interactive music playback.

## Features

- Facial expression recognition from webcam or uploaded images
- Emotion-aware playlist recommendation
- Online music playback and track switching
- Django Admin support for managing playlists and music entries
- Built-in front-end templates with Bootstrap and jQuery

## Project Structure

```text
FERmusicplayer/
├─ faceemotion/               # Emotion recognition module
│  ├─ nnSource/               # Pretrained model files and Haar cascades
│  ├─ Network.py              # Model definitions and training entry
│  ├─ Utils.py                # Data loading and preprocessing
│  ├─ formatPredict.py        # Prediction logic
│  └─ views.py                # Web views and recognition endpoints
├─ musicplayer/               # Music recommendation and playback module
├─ static/                    # Static assets
├─ templates/                 # HTML templates
└─ db.sqlite3                 # Sample database
```

## Environment

- Python 3.7 to 3.10
- Windows, macOS, or Linux

### Main Dependencies

- Django 2.0.7
- TensorFlow 2.x
- opencv-python
- Pillow
- numpy
- pandas
- matplotlib

Example installation:

```bash
pip install "Django==2.0.7" tensorflow==2.6.0 opencv-python pillow numpy pandas matplotlib
```

## Quick Start

1. Clone and enter the project:

```bash
git clone <your-repo-url>
cd FERmusicplayer
```

2. Create a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

On Windows:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3. Install the dependencies listed above.

4. Apply migrations if needed:

```bash
python manage.py makemigrations
python manage.py migrate
```

5. Start the development server:

```bash
python manage.py runserver
```

6. Open the application in a browser:

- Main page / player: `http://127.0.0.1:8000/` or `http://127.0.0.1:8000/player/`
- Music list: `http://127.0.0.1:8000/musics-list/`
- Emotion recognition page: `http://127.0.0.1:8000/fermodel/`
- Recognition endpoint: `/fermodel/recognize/`
- Admin dashboard: `http://127.0.0.1:8000/admin/`

## Emotion Recognition Notes

- Model definitions are in `faceemotion/Network.py`
- Recognition logic is implemented in `faceemotion/formatPredict.py` and `faceemotion/views.py`
- Pretrained checkpoints and Haar cascade files are stored in `faceemotion/nnSource/`

The project includes checkpoint files such as `fermodel.ckpt1.*`. During inference, the app attempts to load the checkpoint automatically.

If you see an error indicating that the checkpoint cannot be found, verify the file paths and TensorFlow compatibility.

## Routing

- `''` routes to the music player module
- `/musics-list/` shows the music list
- `/player/` opens the player
- `/fermodel/` opens the facial expression recognition page
- `/fermodel/recognize/` handles AJAX recognition requests

## Data and Training

- The project uses the `fer2013` dataset
- The label mapping has been simplified from seven classes to five classes
- The training entry point is `train_network` in `faceemotion/Network.py`

If you only need inference, the included checkpoints may be enough. If you want to retrain the model, place `fer2013.csv` under the expected dataset path or update the path handling in `Utils.py`.

## Common Issues

- Empty recognition result:
  - Make sure a face is detected in the input
  - Verify that OpenCV can load the Haar cascade correctly

- Model loading failure:
  - Check whether the checkpoint path is correct
  - Verify TensorFlow version compatibility

- Static files returning 404:
  - Review the static file configuration

- Encoding problems:
  - Use UTF-8 for templates and terminal output

## License and Acknowledgements

- This project is intended for learning and research purposes
- Credit is due to the original model and utility code authors referenced in the source comments

## Contribution

Issues and pull requests are welcome for improving documentation, environment setup, and deployment guidance.
