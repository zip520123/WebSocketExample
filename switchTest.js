switch (0xaa24) {
    case 0xaa24: //get info
        break;
    case 0xaa22: //set Data
    case 0xaa25:
    case 0xaa90:
    case 0xaa91:
    case 0xaa92:
        console.log('set Data')
        break;
    default:
        console.log('parse not in case')
        break;
}