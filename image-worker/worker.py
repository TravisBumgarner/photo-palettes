import time
import psycopg2
import os

conn = psycopg2.connect(os.environ["DATABASE_URL"])
conn.autocommit = True

while True:
    with conn.cursor() as cur:
        cur.execute("SELECT id, data FROM jobs WHERE processed = false LIMIT 10;")
        rows = cur.fetchall()
        for row in rows:
            print(f"Processing {row}")
            cur.execute("UPDATE jobs SET processed = true WHERE id = %s;", (row[0],))
    time.sleep(5)
