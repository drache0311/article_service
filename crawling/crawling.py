from gensim.summarization import keywords
import requests
import datetime
import pandas as pd
import numpy as np
from bs4 import BeautifulSoup
from pymongo import MongoClient
import traceback

from rake_nltk import Rake
import json
import sys

# 영어를 한국어로 번역 ( 카카오 api 사용 )

def eng2kr(query):
    url = 'https://kapi.kakao.com/v1/translation/translate'
    headers = {"Authorization": "KakaoAK 252e6227aaafb3418140ca0e7c4154ab"}
    # headers = {"Authorization" =  "KakaoAK[252e6227aaafb3418140ca0e7c4154ab]" }
    data = {
        "src_lang": "en",
        "target_lang": "kr",
        "query": query
    }
    response = requests.post(url, headers=headers, data=data)
    print(type(response.json()['translated_text']))
    return (''.join((map(str , response.json()['translated_text']))))


# 크롤링


def crwallNews():
    req = requests.get('https://www.reuters.com/news/world')
    req.encoding = 'utf-8'
    title = []
    title_kor = []
    keyword = []
    keyword_kor = []
    summary = []
    summary_kor = []
    upload_day = []
    href = []
    html = req.text
    soup = BeautifulSoup(html, 'html.parser')
    posts = soup.select('.story-content a ')


    r = Rake()



    for i in posts:
        if 'href' in i.attrs:
                plain_title = i.get_text().replace("\t", "").replace("\n", "")
                plain_href = 'https://www.reuters.com/news/world' + str(i.attrs['href'])

                
                # 본문 크롤링
                bsObject = BeautifulSoup(plain_href, "html.parser") 
                body = bsObject.find_all('p','ArticleBody-para-TD_9x')
                bodyText=[] # 본문
                for i in body:
                    bodyText.append(i)
                bodyText = str(bodyText)
                
                bodyText = re.sub('<.+?>', '', bodyText, 0, re.I|re.S)  # 태그 제거
                # 키워드 추출 문
                r.extract_keywords_from_text(bodyText)  # 본문의 키워드 추출
                words = r.get_ranked_phrases() 
                keyword.append(''.join(keywords(words[0:3]).split('\n')))  # 총 3개 키워드 삽입
                
                
                #   summary.append(이거 요약) 요약문인가? 이거 어캐쓰는거임
                href.append(plain_href)
                title.append(plain_title)
                title_kor.append(''.join(eng2kr(i.get_text())))
                upload_day.append(datetime.datetime.utcnow())


    latest = pd.DataFrame({"href": href, "title": title, "title_kor": title_kor , "upload_day" : upload_day})

    latest = latest.fillna(0)
    latest=latest[latest['title'].isin(findMongo()) == False]
    print(latest)
    latest.reset_index(inplace=True)
    data_dict = latest.to_dict("records")
    print(data_dict)
    return data_dict

def insert2Mongo(latest):
    try:
        client = MongoClient('mongodb://dong:dong123@localhost:27017')
        db = client['article_service']
        col =db['Article']
        col.insert_many(latest)
    except Exception as e:
        print(traceback.format_exc())
        print('insert error')


def findMongo():
    results = dict()
    try:
        client = MongoClient('mongodb://dong:dong123@localhost:27017')
        db = client['article_service']
        col =db['Article']
        results= col.distinct('title')
        return results
    except Exception as e:
        print(traceback.format_exc())
        print('find error')

print(findMongo())
latest = crwallNews()
#널 값이 아닐 경우만 insert
if  latest:
    insert2Mongo(latest)