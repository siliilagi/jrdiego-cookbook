import java.util.Scanner;

public class AgeCategory {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Enter your age: ");
        int age = scanner.nextInt();
        
        String category;
        
        if (age < 0) {
            category = "Non-Existent";
        } else if (age <= 2) {
            category = "Infant";
        } else if (age <= 12) {
            category = "Child";
        } else if (age <= 19) {
            category = "Teenager";
        } else if (age <= 59) {
            category = "Adult";
        } else {
            category = "Senior";
        }
        
        System.out.println("Your category is: " + category);
    }
}