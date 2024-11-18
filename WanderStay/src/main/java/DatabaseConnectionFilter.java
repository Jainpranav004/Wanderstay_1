import javax.servlet.*;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;

public class DatabaseConnectionFilter implements Filter {
    private Connection connection;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            connection = DriverManager.getConnection(
                    "jdbc:mysql://localhost:3306/airbnb_clone", "root", "password");
        } catch (Exception e) {
            throw new ServletException("Database connection failed", e);
        }
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        request.setAttribute("connection", connection);
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        try {
            if (connection != null) {
                connection.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
