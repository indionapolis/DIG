from typing import List
import os
import requests
from pandas import DataFrame


class TypeForm:
    def __init__(self, UPLOAD_FOLDER):
        self.TYPE_FORM_TOKEN = 'Bearer DtnUFUj7Ay9bN56vSzsvNnHHivaa2hZGWt2agNmRjspa'
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

        if r.status_code == 404:
            return []

        fields = r.json()['fields']

        return [field['title'] for field in fields]

    def get_data(self, form_id: str) -> List:
        headers = {'Authorization': self.TYPE_FORM_TOKEN}
        r = requests.get(f'https://api.typeform.com/forms/{form_id}/responses', headers=headers)

        if r.status_code == 404:
            return []

        responses = r.json()['items']

        return [[self.retrieve_answer(answer) for answer in response['answers']] for response in responses]

    def upload_adapter(self, form_id: str) -> str:
        labels = self.get_labels(form_id)
        data = self.get_data(form_id)
        filename = f'{form_id}.xlsx'

        if not labels or not data:
            return ''

        df = DataFrame(data=data, columns=labels)

        df.to_excel(os.path.join(self.UPLOAD_FOLDER, filename), index=False)

        return filename

    def get_number_of_records(self, form_id):
        headers = {'Authorization': self.TYPE_FORM_TOKEN}
        r = requests.get(f'https://api.typeform.com/forms/{form_id}/responses', headers=headers)

        if r.status_code == 404:
            return 0

        number_of_records = r.json()['total_items']

        return number_of_records
