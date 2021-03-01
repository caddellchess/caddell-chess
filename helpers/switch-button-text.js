const switchButtonText = async (instr, nextion) => {
  if (instr == 'initial' || !buttonsAreLetters) {
    await nextion.setValue('page1.b0.txt', '"A"');
    await nextion.setValue('page1.b1.txt', '"B"');
    await nextion.setValue('page1.b2.txt', '"C"');
    await nextion.setValue('page1.b3.txt', '"D"');
    await nextion.setValue('page1.b4.txt', '"E"');
    await nextion.setValue('page1.b5.txt', '"F"');
    await nextion.setValue('page1.b6.txt', '"G"');
    await nextion.setValue('page1.b7.txt', '"H"');
    buttonsAreLetters = true;
  } else {
    await nextion.setValue('page1.b0.txt', '"1"');
    await nextion.setValue('page1.b1.txt', '"2"');
    await nextion.setValue('page1.b2.txt', '"3"');
    await nextion.setValue('page1.b3.txt', '"4"');
    await nextion.setValue('page1.b4.txt', '"5"');
    await nextion.setValue('page1.b5.txt', '"6"');
    await nextion.setValue('page1.b6.txt', '"7"');
    await nextion.setValue('page1.b7.txt', '"8"');
    buttonsAreLetters = false;
  }
  return buttonsAreLetters;
}

module.exports = { switchButtonText };
