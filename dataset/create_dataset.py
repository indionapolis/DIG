from random import shuffle, randint
from pandas import DataFrame

with open('names.txt', 'r') as file:
    name_set = file.read().split('\n')

with open('soft_skills.txt', 'r') as file:
    soft_skills_set = file.read().split('\n')

with open('hard_skills.txt', 'r') as file:
    hard_skills_set = file.read().split('\n')


index = ['Full Name', 'Soft Skills', 'Hard Skills']
data = []

shuffle(name_set)

for name in name_set:
    shuffle(soft_skills_set)
    shuffle(hard_skills_set)
    data.append([name, ', '.join(soft_skills_set[0:randint(1,3)]), ', '.join(hard_skills_set[0:randint(1,3)])])

df = DataFrame(data=data, columns=index)

df.to_excel('sample.xlsx', index=False)

