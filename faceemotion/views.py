import base64
from io import BytesIO
import os

from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.views.generic import View
from PIL import Image

from .formatPredict import PIL_detect


def picture_ajax_upload(request):
    data = {}
    if request.POST['type'] == '1':
        print('摄像头')
        img = request.POST['image']     # data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA
        img_str = img.split(',')[1]     # 获取后方的图片内容  STR
        img_dec = base64.b64decode(img_str)     # base64解码
        # 保存图片
        output_path = 'C:\\Users\\xxuu\\Desktop\\FERmusicplayer\\faceemotion\\media\\pictures\\input.png'
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'wb') as output:
            output.write(img_dec)
        # 使用Image打开  字节流转image
        temp = BytesIO(img_dec)
        image = Image.open(temp)
    else:
        print("上传")
        image = Image.open(request.FILES['image'])
        output_path = 'C:\\Users\\xxuu\\Desktop\\FERmusicplayer\\faceemotion\\media\\pictures\\input.png'
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        image.save(output_path)
    # 识别表情 测试时候注释下方
    pred, result = PIL_detect(image)
    if pred != -1:
        data = {i: result[i] for i in range(5)}
    else:
        data = {}
    data[5] = pred
    return JsonResponse(data)
