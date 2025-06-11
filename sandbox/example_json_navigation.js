var json_str = `{"hello": "world", "nested": {"key": "value"}, "array": [1, 2, 3]}`;
var json_obj = JSON.parse(json_str);
console.log(json_obj.hello);
console.log(json_obj.nested.key);
var nested = json_obj.nested;
console.log(nested.key);
console.log(json_obj.array[0]);

// obj.articles[3].categories[0] 