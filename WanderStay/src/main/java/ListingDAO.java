import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ListingDAO {
    private Connection connection;

    public ListingDAO(Connection connection) {
        this.connection = connection;
    }

    public List<Listing> getAllListings() throws SQLException {
        List<Listing> listings = new ArrayList<>();
        String query = "SELECT * FROM listings";
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            while (rs.next()) {
                listings.add(new Listing(
                        rs.getInt("id"),
                        rs.getString("title"),
                        rs.getString("description"),
                        rs.getDouble("price"),
                        rs.getString("location")));
            }
        }
        return listings;
    }

    public void addListing(Listing listing) throws SQLException {
        String query = "INSERT INTO listings (title, description, price, location) VALUES (?, ?, ?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(query)) {
            pstmt.setString(1, listing.getTitle());
            pstmt.setString(2, listing.getDescription());
            pstmt.setDouble(3, listing.getPrice());
            pstmt.setString(4, listing.getLocation());
            pstmt.executeUpdate();
        }
    }

    public void updateListing(Listing listing) throws SQLException {
        String query = "UPDATE listings SET title = ?, description = ?, price = ?, location = ? WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(query)) {
            pstmt.setString(1, listing.getTitle());
            pstmt.setString(2, listing.getDescription());
            pstmt.setDouble(3, listing.getPrice());
            pstmt.setString(4, listing.getLocation());
            pstmt.setInt(5, listing.getId());
            pstmt.executeUpdate();
        }
    }

    public void deleteListing(int id) throws SQLException {
        String query = "DELETE FROM listings WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(query)) {
            pstmt.setInt(1, id);
            pstmt.executeUpdate();
        }
    }
}
