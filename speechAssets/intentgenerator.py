import itertools

letters = ['zero','one','two','three','four','five','six','seven','eight','nine','a.','b.','c.','d.','e.','f.','g.','h.','i.','j.','k.','l.','m.','n.','o.','p.','q.','r.','s.','t.','u.','v.','w.','x.','y.','z.']

beginString = "EnterPinIntent my pin is "
endString = ""

def slot(pinKey,pinValue):
    return "{" + pinKey + " | " + pinValue + "} "

for letter in letters:
   slot1 = slot(letter,"PinOne")
   slot2 = slot(letter,"PinTwo")
   slot3 = slot(letter,"PinThree")
   slot4 = slot(letter,"PinFour")
   slot5 = slot(letter,"PinFive")
   slot6 = slot(letter,"PinSix")
   slot7 = slot(letter,"PinSeven")
   slot8 = slot(letter,"PinEight")
   print beginString + slot1 + slot2 + slot3 + slot4 + slot5 + slot6 + slot7 + slot8 + endString

