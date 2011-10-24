document.on('click', 'a.add_nested_fields', function(event, element) {
  // Setup
  var assoc   = element.readAttribute('data-association');           // Name of child
  var content = $(assoc + '_fields_blueprint').innerHTML; // Fields template

  // Make the context correct by replacing new_<parents> with the generated ID
  // of each of the parent objects
  var context = null;
  if (element.up('.fields') != undefined)
  {
    context = element.up('.fields').down('input').readAttribute('name').replace(new RegExp('\[[a-z]+\]$'), '');
  }

  // context will be something like this for a brand new form:
  // project[tasks_attributes][new_1255929127459][assignments_attributes][new_1255929128105]
  // or for an edit form:
  // project[tasks_attributes][0][assignments_attributes][1]
  if (context)
  {
    var parent_names = context.match(/[a-z_]+_attributes/g) || [];
    var parent_ids   = context.match(/(new_)?[0-9]+/g) || [];

    for(i = 0; i < parent_names.length; i++)
    {
      if(parent_ids[i])
      {
        content = content.replace(new RegExp('(_' + parent_names[i] + ')_.+?_', 'g'), '$1_' + parent_ids[i] + '_');
        content = content.replace(new RegExp('(\\[' + parent_names[i] + '\\])\\[.+?\\]', 'g'), '$1[' + parent_ids[i] + ']');
      }
    }
  }

  // Make a unique ID for the new child
  var regexp  = new RegExp('new_' + assoc, 'g');
  var new_id  = new Date().getTime();
  content     = content.replace(regexp, "new_" + new_id);

  element.insert({ before: content });

  return false;
}.bind(this));

document.on('click', 'a.remove_nested_fields', function(event, element) {
  var hidden_field = element.previous(0);
  if(hidden_field) hidden_field.value = '1';
  element.up('div.fields').hide();

  return false;
}.bind(this));

