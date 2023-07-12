package com.mercurius.models;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class URIEncoder {
	
	public String encodeURI(String s) {
        String result;
        try {
//            result = URLEncoder.encode(s, "UTF-8").replaceAll("\\+", "%20").replaceAll("\\%21", "!")
//                    .replaceAll("\\%27", "'").replaceAll("\\%28", "(").replaceAll("\\%29", ")")
//                    .replaceAll("\\%7E", "~");
        	
        	 result = URLEncoder.encode(s,StandardCharsets.UTF_8.name())
        			 .replaceAll("\\+", "%2B")
        				
         			.replaceAll("0", "%30").replaceAll("1", "%31").replaceAll("2", "%32").replaceAll("3", "%33")
         			.replaceAll("4", "%34").replaceAll("5", "%35").replaceAll("6", "%36").replaceAll("7", "%37").replaceAll("8", "%38")
         			.replaceAll("9", "%39").replaceAll(":", "%3A").replaceAll(";", "%3B").replaceAll("<","%3C").replaceAll("=", "%3D")
         			.replaceAll(">", "%3E").replaceAll("\\?", "%3F").replaceAll("@", "%40")
 					
 					.replaceAll("a", "%61").replaceAll("b", "%62").replaceAll("c", "%63").replaceAll("d", "%64").replaceAll("e", "%65")
         			.replaceAll("f", "%66").replaceAll("g", "%67").replaceAll("h", "%68").replaceAll("i", "%69").replaceAll("j", "%6A")
         			.replaceAll("k", "%6B").replaceAll("l", "%6C").replaceAll("m", "%6D").replaceAll("n", "%6E").replaceAll("o", "%6F")
         			.replaceAll("p", "%70").replaceAll("q", "%71").replaceAll("r", "%72").replaceAll("s", "%73").replaceAll("t", "%74")
         			.replaceAll("u", "%75").replaceAll("v", "%76").replaceAll("w", "%77").replaceAll("x", "%78").replaceAll("y","%79").replaceAll("z","%7A")
         			
         			.replaceAll("A", "%41").replaceAll("B", "%42")
         			.replaceAll("C", "%43").replaceAll("D", "%44").replaceAll("E", "%45").replaceAll("F", "%46").replaceAll("G", "%47")
         			.replaceAll("H", "%48").replaceAll("I", "%49").replaceAll("J", "%4A").replaceAll("K", "%4B").replaceAll("L", "%4C")
         			.replaceAll("M", "%4D").replaceAll("N", "%4E").replaceAll("O", "%4F").replaceAll("P", "%50").replaceAll("Q", "%51")
         			.replaceAll("R", "%52").replaceAll("S", "%53").replaceAll("T", "%54").replaceAll("U", "%55").replaceAll("V", "%56")
         			.replaceAll("W", "%57").replaceAll("X", "%58").replaceAll("Y", "%59").replaceAll("Z", "%5A")
         			
         			.replaceAll("¡", "%C2%A1")
         			.replaceAll("¢", "%C2%A2").replaceAll("£", "%C2%A3").replaceAll("¤", "%C2%A4").replaceAll("¥", "%C2%A5")
         			.replaceAll("¦", "%C2%A6").replaceAll("§", "%C2%A7").replaceAll("¨", "%C2%A8").replaceAll("©", "%C2%A9")
         			.replaceAll("ª", "%C2%AA").replaceAll("«", "%C2%AB").replaceAll("¬", "%C2%AC").replaceAll("®", "%C2%AE")
         			.replaceAll("¯", "%C2%AF").replaceAll("°", "%C2%B0").replaceAll("±", "%C2%B1").replaceAll("²", "%C2%B2")
         			.replaceAll("³", "%C2%B3").replaceAll("´", "%C2%B4").replaceAll("µ", "%C2%B5").replaceAll("¶", "%C2%B6")
         			.replaceAll("·", "%C2%B7").replaceAll("¸", "%C2%B8").replaceAll("¹", "%C2%B9").replaceAll("º", "%C2%BA")
         			.replaceAll("»", "%C2%BB").replaceAll("¼", "%C2%BC").replaceAll("½", "%C2%BD").replaceAll("¾", "%C2%BE")
         			.replaceAll("¿", "%C2%BF").replaceAll("À", "%C3%80").replaceAll("Á", "%C3%81").replaceAll("Â", "%C3%82")
         			.replaceAll("Ã", "%C3%83").replaceAll("Ä", "%C3%84").replaceAll("Å", "%C3%85").replaceAll("Æ", "%C3%86")
         			.replaceAll("Ç", "%C3%87").replaceAll("È", "%C3%88").replaceAll("É", "%C3%89").replaceAll("Ê", "%C3%8A")
         			.replaceAll("Ë", "%C3%8B").replaceAll("Ì", "%C3%8C").replaceAll("Í", "%C3%8D").replaceAll("Î", "%C3%8E")
         			.replaceAll("Ï", "%C3%8F").replaceAll("Ð", "%C3%90").replaceAll("Ñ", "%C3%91").replaceAll("Ò", "%C3%92")
         			.replaceAll("Ó", "%C3%93").replaceAll("Ô", "%C3%94").replaceAll("Õ", "%C3%95").replaceAll("Ö", "%C3%96")
         			.replaceAll("×", "%C3%97").replaceAll("Ø", "%C3%98").replaceAll("Ù", "%C3%99").replaceAll("Ú", "%C3%9A")
         			.replaceAll("Û", "%C3%9B").replaceAll("Ü", "%C3%9C").replaceAll("Ý", "%C3%9D").replaceAll("Þ", "%C3%9E")
         			.replaceAll("ß", "%C3%9F").replaceAll("à", "%C3%A0").replaceAll("á", "%C3%A1").replaceAll("â", "%C3%A2")
         			.replaceAll("ã", "%C3%A3").replaceAll("ä", "%C3%A4").replaceAll("å", "%C3%A5").replaceAll("æ", "%C3%A6")
         			.replaceAll("ç", "%C3%A7").replaceAll("è", "%C3%A8").replaceAll("é", "%C3%A9").replaceAll("ê", "%C3%AA")
         			.replaceAll("ë", "%C3%AB").replaceAll("ì", "%C3%AC").replaceAll("í", "%C3%AD").replaceAll("î", "%C3%AE")
         			.replaceAll("ï", "%C3%AF").replaceAll("ð", "%C3%B0").replaceAll("ñ", "%C3%B1").replaceAll("ò", "%C3%B2")
         			.replaceAll("ó", "%C3%B3").replaceAll("ô", "%C3%B4").replaceAll("õ", "%C3%B5").replaceAll("ö", "%C3%B6")
         			.replaceAll("÷", "%C3%B7").replaceAll("ø", "%C3%B8").replaceAll("ù", "%C3%B9").replaceAll("ú", "%C3%BA")
         			.replaceAll("û", "%C3%BB").replaceAll("ü", "%C3%BC").replaceAll("ý", "%C3%BD").replaceAll("þ", "%C3%BE")
         			.replaceAll("ÿ", "%C3%BF");
         			
          /*.replaceAll(" ", "%20").replaceAll("!","%21").replaceAll("\"","%22").replaceAll("#", "%23").replaceAll("$", "%24")
 			.replaceAll("%", "%25").replaceAll("&", "%26").replaceAll("'", "%27").replaceAll("\\(", "%28").replaceAll("\\)", "%29")
 			.replaceAll("\\*", "%2A").replaceAll("\\+", "%2B").replaceAll(",","%2C").replaceAll("-", "%2D").replaceAll(".", "%2E")
 			.replaceAll("/", "%2F").replaceAll("0", "%30").replaceAll("1", "%31").replaceAll("2", "%32").replaceAll("3", "%33")
 			.replaceAll("4", "%34").replaceAll("5", "%35").replaceAll("6", "%36").replaceAll("7", "%37").replaceAll("8", "%38")
 			.replaceAll("9", "%39").replaceAll(":", "%3A").replaceAll(";", "%3B").replaceAll("<","%3C").replaceAll("=", "%3D")
 			.replaceAll(">", "%3E").replaceAll("\\?", "%3F").replaceAll("@", "%40").replaceAll("A", "%41").replaceAll("B", "%42");
 			.replaceAll("C", "%43").replaceAll("D", "%44").replaceAll("E", "%45").replaceAll("F", "%46").replaceAll("G", "%47")
 			.replaceAll("H", "%48").replaceAll("I", "%49").replaceAll("J", "%4A").replaceAll("K", "%4B").replaceAll("L", "%4C")
 			.replaceAll("M", "%4D").replaceAll("N", "%4E").replaceAll("O", "%4F").replaceAll("P", "%50").replaceAll("Q", "%51")
 			.replaceAll("R", "%52").replaceAll("S", "%53").replaceAll("T", "%54").replaceAll("U", "%55").replaceAll("V", "%56")
 			.replaceAll("W", "%57").replaceAll("X", "%58").replaceAll("Y", "%59").replaceAll("Z", "%5A").replaceAll("\\[", "%5B")
 			.replaceAll("\\\\", "%5C").replaceAll("\\]", "%5D").replaceAll("^", "%5E").replaceAll("_", "%5F").replaceAll("`", "%60")
 			.replaceAll("a", "%61").replaceAll("b", "%62").replaceAll("c", "%63").replaceAll("d", "%64").replaceAll("e", "%65")
 			.replaceAll("f", "%66").replaceAll("g", "%67").replaceAll("h", "%68").replaceAll("i", "%69").replaceAll("j", "%6A")
 			.replaceAll("k", "%6B").replaceAll("l", "%6C").replaceAll("m", "%6D").replaceAll("n", "%6E").replaceAll("o", "%6F")
 			.replaceAll("p", "%70").replaceAll("q", "%71").replaceAll("r", "%72").replaceAll("s", "%73").replaceAll("t", "%74")
 			.replaceAll("u", "%75").replaceAll("v", "%76").replaceAll("w", "%77").replaceAll("x", "%78").replaceAll("y","%79")
 			.replaceAll("z","%7A").replaceAll("\\{","%7B").replaceAll("|", "%7C").replaceAll("\\}", "%7D").replaceAll("~", "%7E")
 			.replaceAll("€", "%E2%82%AC").replaceAll("‚", "	%E2%80%9A").replaceAll("ƒ", "%C6%92").replaceAll("„", "%E2%80%9E")
 			.replaceAll("…", "%E2%80%A6").replaceAll("†", "%E2%80%A0").replaceAll("‡", "%E2%80%A1").replaceAll("ˆ", "%CB%86")
 			.replaceAll("‰", "%E2%80%B0").replaceAll("Š", "%C5%A0").replaceAll("‹", "%E2%80%B9").replaceAll("Œ", "%C5%92")
 			.replaceAll("Ž", "%C5%BD").replaceAll("‘", "%E2%80%98").replaceAll("’", "%E2%80%99").replaceAll("“", "%E2%80%9C")
 			.replaceAll("”", "%E2%80%9D").replaceAll("•", "	%E2%80%A2").replaceAll("–", "%E2%80%93").replaceAll("—", "%E2%80%94")
 			.replaceAll("˜", "%CB%9C").replaceAll("™", "%E2%84").replaceAll("š", "%C5%A1").replaceAll("›", "%E2%80")
 			.replaceAll("œ", "%C5%93").replaceAll("ž", "%C5%BE").replaceAll("Ÿ", "%C5%B8").replaceAll("¡", "%C2%A1")
 			.replaceAll("¢", "%C2%A2").replaceAll("£", "%C2%A3").replaceAll("¤", "%C2%A4").replaceAll("¥", "%C2%A5")
 			.replaceAll("¦", "%C2%A6").replaceAll("§", "%C2%A7").replaceAll("¨", "%C2%A8").replaceAll("©", "%C2%A9")
 			.replaceAll("ª", "%C2%AA").replaceAll("«", "%C2%AB").replaceAll("¬", "%C2%AC").replaceAll("®", "%C2%AE")
 			.replaceAll("¯", "%C2%AF").replaceAll("°", "%C2%B0").replaceAll("±", "%C2%B1").replaceAll("²", "%C2%B2")
 			.replaceAll("³", "%C2%B3").replaceAll("´", "%C2%B4").replaceAll("µ", "%C2%B5").replaceAll("¶", "%C2%B6")
 			.replaceAll("·", "%C2%B7").replaceAll("¸", "%C2%B8").replaceAll("¹", "%C2%B9").replaceAll("º", "%C2%BA")
 			.replaceAll("»", "%C2%BB").replaceAll("¼", "%C2%BC").replaceAll("½", "%C2%BD").replaceAll("¾", "%C2%BE")
 			.replaceAll("¿", "%C2%BF").replaceAll("À", "%C3%80").replaceAll("Á", "%C3%81").replaceAll("Â", "%C3%82")
 			.replaceAll("Ã", "%C3%83").replaceAll("Ä", "%C3%84").replaceAll("Å", "%C3%85").replaceAll("Æ", "%C3%86")
 			.replaceAll("Ç", "%C3%87").replaceAll("È", "%C3%88").replaceAll("É", "%C3%89").replaceAll("Ê", "%C3%8A")
 			.replaceAll("Ë", "%C3%8B").replaceAll("Ì", "%C3%8C").replaceAll("Í", "%C3%8D").replaceAll("Î", "%C3%8E")
 			.replaceAll("Ï", "%C3%8F").replaceAll("Ð", "%C3%90").replaceAll("Ñ", "%C3%91").replaceAll("Ò", "%C3%92")
 			.replaceAll("Ó", "%C3%93").replaceAll("Ô", "%C3%94").replaceAll("Õ", "%C3%95").replaceAll("Ö", "%C3%96")
 			.replaceAll("×", "%C3%97").replaceAll("Ø", "%C3%98").replaceAll("Ù", "%C3%99").replaceAll("Ú", "%C3%9A")
 			.replaceAll("Û", "%C3%9B").replaceAll("Ü", "%C3%9C").replaceAll("Ý", "%C3%9D").replaceAll("Þ", "%C3%9E")
 			.replaceAll("ß", "%C3%9F").replaceAll("à", "%C3%A0").replaceAll("á", "%C3%A1").replaceAll("â", "%C3%A2")
 			.replaceAll("ã", "%C3%A3").replaceAll("ä", "%C3%A4").replaceAll("å", "%C3%A5").replaceAll("æ", "%C3%A6")
 			.replaceAll("ç", "%C3%A7").replaceAll("è", "%C3%A8").replaceAll("é", "%C3%A9").replaceAll("ê", "%C3%AA")
 			.replaceAll("ë", "%C3%AB").replaceAll("ì", "%C3%AC").replaceAll("í", "%C3%AD").replaceAll("î", "%C3%AE")
 			.replaceAll("ï", "%C3%AF").replaceAll("ð", "%C3%B0").replaceAll("ñ", "%C3%B1").replaceAll("ò", "%C3%B2")
 			.replaceAll("ó", "%C3%B3").replaceAll("ô", "%C3%B4").replaceAll("õ", "%C3%B5").replaceAll("ö", "%C3%B6")
 			.replaceAll("÷", "%C3%B7").replaceAll("ø", "%C3%B8").replaceAll("ù", "%C3%B9").replaceAll("ú", "%C3%BA")
 			.replaceAll("û", "%C3%BB").replaceAll("ü", "%C3%BC").replaceAll("ý", "%C3%BD").replaceAll("þ", "%C3%BE")
 			.replaceAll("ÿ", "%C3%BF");*/
	        	 
        			
        } // This exception should never occur.
        catch (Exception e) {
            result = s;
        }

        return result;

}
}
