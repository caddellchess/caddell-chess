const setupCombobox = async (scrollableList, nextion) => {
  await nextion.setValue('h0.minval', 0);
  await nextion.setValue('h0.maxval', (scrollableList.length - 4));
  await nextion.setValue('h0.val', scrollableList.length - 4);

  await nextion.setValue('b3.txt', `"${scrollableList[0].hmi}"`);
  await nextion.setValue('b4.txt', `"${scrollableList[1].hmi}"`);
  await nextion.setValue('b5.txt', `"${scrollableList[2].hmi}"`);
  await nextion.setValue('b6.txt', `"${scrollableList[3].hmi}"`);
}

module.exports = setupCombobox;
