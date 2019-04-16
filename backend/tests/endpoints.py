import unittest
import sys
sys.path.append('/Users/Pavel/programs/DIG/backend')
from app import *


class StuffTestCase(unittest.TestCase):
    def test_allowed_file(self):
        self.assertTrue(allowed_file('some.xlsx'))
        self.assertFalse(allowed_file('some_string'))


class ServerTestCase(unittest.TestCase):
    # executed prior to each test
    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()
        # Disable sending emails during unit testing
        self.assertEqual(app.debug, False)

    def test_upload_from_outsource(self):
        response = self.app.post('/upload_from_outsource')
        self.assertEqual(response.status_code, 405)

        response = self.app.get('/upload_from_outsource')
        self.assertEqual(response.status_code, 400)

        response = self.app.get('/upload_from_outsource', data='{"form_id": "1drqe"}')
        self.assertEqual(response.status_code, 400)

    def test_upload(self):
        response = self.app.get('/upload')
        self.assertEqual(response.status_code, 404)

        response = self.app.post('/upload')
        self.assertEqual(response.status_code, 400)


if __name__ == "__main__":
    unittest.main()
