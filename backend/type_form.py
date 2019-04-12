from typing import List
import os
import requests
from pandas import DataFrame


class TypeForm:
    def __init__(self, UPLOAD_FOLDER):
        self.TYPE_FORM_TOKEN = 'Bearer EY4YA4XgJwuQyVLUVKNpW2inHBqyW6vZWzYD5D4a3DLF'
        self.UPLOAD_FOLDER = UPLOAD_FOLDER

    @staticmethod
    def retrieve_answer(answer):
        if 'text' in answer:
            return answer['text']
        elif 'choice' in answer:
            return answer['choice']['label']
        elif 'choices' in answer:
            return ', '.join(answer['choices']['labels'])

        return 'none'

    def get_labels(self, form_id: str) -> List[str]:
        headers = {'Authorization': self.TYPE_FORM_TOKEN}
        r = requests.get(f'https://api.typeform.com/forms/{form_id}', headers=headers)
        fields = r.json()['fields']

        return [field['title'] for field in fields]

    def get_data(self, form_id: str) -> List:
        headers = {'Authorization': self.TYPE_FORM_TOKEN}
        r = requests.get(f'https://api.typeform.com/forms/{form_id}/responses', headers=headers)
        responses = r.json()['items']

        return [[self.retrieve_answer(answer) for answer in response['answers']] for response in responses]

    def upload_adapter(self, form_id: str) -> str:
        labels = self.get_labels(form_id)
        data = self.get_data(form_id)
        filename = f'{form_id}.xlsx'

        df = DataFrame(data=data, columns=labels)

        df.to_excel(os.path.join(self.UPLOAD_FOLDER, filename), index=False)

        return filename
