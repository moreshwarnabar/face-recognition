def write_result(key, result):
    file_name = f'/tmp/{key}.txt'
    with open(file_name, 'w+') as f:
        f.write(result)
    return file_name