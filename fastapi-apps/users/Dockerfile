FROM python:3.12

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

RUN chmod +x entrypoint.sh  

ENTRYPOINT ["./entrypoint.sh"]

CMD ["python", "main.py"]
