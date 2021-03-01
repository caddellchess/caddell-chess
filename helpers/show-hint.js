const showHint = async (nextion, hint) => {
  await nextion.setValue('page1.t0.font', '2');
  await nextion.setValue('page1.t0.pco', '52857');
  await nextion.setValue('page1.t0.txt', `"hint: ${hint}"`);
  await nextion.setVisible('t4', false);
  await nextion.setVisible('t5', false);
}

module.exports = { showHint };
