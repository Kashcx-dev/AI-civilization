#include <iostream>
#include <string>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <poll.h>
#include <unistd.h>
#include <cstring>
#include <vector>

using namespace std;

#define PORT 5000

int main() {
    int server_socket = socket(AF_INET, SOCK_STREAM, 0);
    if(server_socket < 0) {
        cerr << "Socket creation error\n";
        return 1;
    }

    int opt = 1;
    if (setsockopt(server_socket, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt))) {
        cerr << "setsockopt error\n";
        return 1;
    }

    sockaddr_in server_addr;
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(PORT);

    if(bind(server_socket, (struct sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        cerr << "Error on binding\n";
        return 1;
    }

    if(listen(server_socket, 10) < 0) {
        cerr << "Error on listen\n";
        return 1;
    }

    cout << "Server listening on port " << PORT << "\n";

    vector<pollfd> pfds;
    pfds.push_back({server_socket, POLLIN, 0});

    while (true) {
        int poll_count = poll(pfds.data(), pfds.size(), -1);
        if (poll_count < 0) {
            cerr << "Poll error\n";
            break;
        }

        for (size_t i = 0; i < pfds.size(); ++i) {
            if (pfds[i].revents & POLLIN) {
                if (pfds[i].fd == server_socket) {
                    // New connection
                    sockaddr_in client_addr;
                    socklen_t client_len = sizeof(client_addr);
                    int client_socket = accept(server_socket, (struct sockaddr*)&client_addr, &client_len);
                    
                    if (client_socket < 0) {
                        cerr << "Accept error\n";
                    } else {
                        cout << "New agent connected.\n";
                        pfds.push_back({client_socket, POLLIN, 0});
                        
                        // Send prompt
                        string prompt = "Please enter agentID and thought:\n";
                        send(client_socket, prompt.c_str(), prompt.length(), 0);
                    }
                } else {
                    // Data from client
                    char buffer[1024];
                    memset(buffer, 0, sizeof(buffer));
                    ssize_t bytes_read = recv(pfds[i].fd, buffer, sizeof(buffer) - 1, 0);
                    
                    if (bytes_read <= 0) {
                        // Connection closed or error
                        cout << "Agent disconnected.\n";
                        close(pfds[i].fd);
                        pfds.erase(pfds.begin() + i);
                        --i; // Adjust index after erase
                    } else {
                        string data(buffer);
                        cout << "Received: " << data;
                        
                        // TODO: Parse agentID and thought here
                    }
                }
            }
        }
    }

    close(server_socket);
    return 0;
}