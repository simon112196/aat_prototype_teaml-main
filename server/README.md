# **Automated Assessment Tool Server**

## **Environmental variables**

Create a file at the root of the project, called ```.env```.  
First, we need to create and copy a secret key. Open a terminal:

```bash
python
```

```python
import uuid
uuid.uuid4().hex
```

Copy the result (preferably without the quotes at the start and end).  
Next, fill in the following variables:

```bash
FLASK_ENV=development
HOST=<SERVER_HOST>                           # 127.0.0.1 in dev
PORT=<SERVER_PORT>                           # Choose whatever number you want
SECRET_KEY=<SECRET_KEY>                      # Paste secret key here
SQLALCHEMY_DATABASE_URI=sqlite:///sqlite.db
```

Replace each word encapsulated with "<>" with its corresponding value.

## **Troubleshooting**

- Make sure that your project is always up to date
- Git: If you have saved but uncommited changes but need to pull, stash the changes, pull and then apply the latest stash
- If the project does not launch after a pull, try deleting the ```/venv``` directory, recrete a `venv` and re-intsall all packages.

## **Available Scripts**

In the project directory, once you have your envionment setup, you can run the project

```bash
python wsgi.py
```
