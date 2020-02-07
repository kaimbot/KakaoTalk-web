from flask import Flask, render_template, redirect, request
import requests
import json

from app import app
from app.tools import save_token, call_token
from app.constants import *

'''
회원가입 절차

1. 사용자는 카카오계정으로 로그인 버튼을 클릭합니다. 
2. 카카오톡 앱에 연결된 카카오계정의 자격정보(Credentials)를 통해 사용자를 인식합니다.
3. 자격정보가 올바르다면 사용자(Resource Owner)로부터 접근 자원에 대한 동의/허가를 얻습니다.
4. 위 3까지 성공적으로 수행되었다면 인증 코드(Authorization Code)가 발급됩니다. 해당 인증 코드는 Redirection URI를 기반으로 Third 앱에 전달됩니다.
5. Third 앱에서는 전달받은 인증 코드를 기반으로 사용자 토큰(Access Token, Refresh Token)을 요청하고 얻게 됩니다.
'''